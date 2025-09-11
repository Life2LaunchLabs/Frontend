import { getApiUrl } from '../config/api';

export class ChatService {
  constructor() {
    this.baseURL = getApiUrl('/api/chat');
    this.sessions = {
      minu: { 
        messages: [], 
        currentState: this.getDefaultState(),
        agendaItems: [],
        completedItems: [],
        courseId: null
      },
      mora: { 
        messages: [], 
        currentState: this.getDefaultState(),
        agendaItems: [],
        completedItems: [],
        courseId: null
      },
      tula: { 
        messages: [], 
        currentState: this.getDefaultState(),
        agendaItems: [],
        completedItems: [],
        courseId: null
      }
    };
    this.activePreset = null;
  }

  setActivePreset(preset) {
    this.activePreset = preset;
  }

  async setCourseId(character, courseId) {
    if (this.sessions[character]) {
      this.sessions[character].courseId = courseId;
      // Reset session when course changes
      if (courseId) {
        this.sessions[character].messages = [];
        this.sessions[character].currentState = this.getDefaultState();
        this.sessions[character].agendaItems = [];
        this.sessions[character].completedItems = [];
        
        // Load agenda items immediately when course is set
        try {
          await this.loadAgendaForCourse(character, courseId);
        } catch (error) {
          console.error('Failed to load agenda for course:', error);
        }
      }
    }
  }

  async loadAgendaForCourse(character, courseId) {
    try {
      // Get auth token if available
      const token = localStorage.getItem('access_token');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Make a request to get agenda items for the course
      const response = await fetch(`${this.baseURL}/send/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          character: character,
          message: 'start', // Initial message to get agenda
          messages: [],
          llm_config: {
            course_id: courseId,
            provider: this.activePreset?.provider || 'anthropic',
            model: this.activePreset?.model || 'claude-3-5-sonnet-20241022',
            temperature: 0.7,
            maxTokens: 1000
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.agendaItems && data.agendaItems.length > 0) {
          const session = this.sessions[character];
          session.agendaItems = data.agendaItems;
          session.completedItems = new Array(data.agendaItems.length).fill(null);
          
          // Update with any existing completion data
          if (data.session && data.session.completed_items) {
            for (const [itemNumber, answer] of Object.entries(data.session.completed_items)) {
              const index = parseInt(itemNumber) - 1;
              if (index >= 0 && index < session.completedItems.length) {
                session.completedItems[index] = answer;
              }
            }
          }
          
          // Store initial AI response
          session.currentState = {
            emote: data.emote || 'idle',
            message: data.message || 'Hello! Let\'s get started.',
            quickInputs: data.quickInputs || [],
            system: data.system || { active_item: 1, completed_item: null },
            isLoading: false
          };
          
          if (data.messages) {
            session.messages = data.messages;
          }
          
          if (data.session) {
            session.backendSession = data.session;
          }
        }
      }
    } catch (error) {
      console.error('Error loading agenda for course:', error);
    }
  }

  getDefaultState() {
    return {
      emote: 'idle',
      message: 'Hello! How can I help you today?',
      quickInputs: ['Hi there!', 'Tell me about yourself'],
      system: { active_item: 1, completed_item: null },
      isLoading: false
    };
  }

  async sendToBackend(messages, character, userMessage) {

    try {
      const requestBody = {
        character: character,
        message: userMessage,
        messages: messages
      };

      // Include preset configuration if available
      if (this.activePreset) {
        requestBody.llm_config = {
          provider: this.activePreset.provider,
          model: this.activePreset.model,
          temperature: this.activePreset.temperature,
          maxTokens: this.activePreset.maxTokens
        };
      } else {
        requestBody.llm_config = {};
      }

      // Include course_id if set for this character
      const session = this.sessions[character];
      if (session && session.courseId) {
        requestBody.llm_config.course_id = session.courseId;
      }

      // Get auth token if available
      const token = localStorage.getItem('access_token');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}/send/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Backend API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Backend API Error:', error);
      throw error;
    }
  }

  async sendMessage(character, userMessage) {
    if (!this.sessions[character]) {
      throw new Error(`Unknown character: ${character}`);
    }

    const session = this.sessions[character];
    session.currentState.isLoading = true;

    try {
      const response = await this.sendToBackend(session.messages, character, userMessage);
      
      // Update session with the new messages from backend
      if (response.messages) {
        session.messages = response.messages;
      }

      // Initialize agenda items if not already set or if new items are provided
      if (response.agendaItems && response.agendaItems.length > 0) {
        if (session.agendaItems.length === 0) {
          session.agendaItems = response.agendaItems;
          session.completedItems = new Array(response.agendaItems.length).fill(null);
        }
      }

      // Update completion status from backend session data
      if (response.session && response.session.completed_items) {
        // Reset completion array
        session.completedItems = new Array(session.agendaItems.length).fill(null);
        
        // Update with completed items from session
        for (const [itemNumber, answer] of Object.entries(response.session.completed_items)) {
          const index = parseInt(itemNumber) - 1; // Convert to 0-based index
          if (index >= 0 && index < session.completedItems.length) {
            session.completedItems[index] = answer;
          }
        }
      } else {
        // Fallback to system data for backwards compatibility
        const systemData = response.system || { active_item: 1, completed_item: null };
        if (systemData.completed_item) {
          // completed_item format: {"1": "answer"} or {"3": true}
          for (const [itemNumber, answer] of Object.entries(systemData.completed_item)) {
            const index = parseInt(itemNumber) - 1; // Convert to 0-based index
            if (index >= 0 && index < session.completedItems.length) {
              session.completedItems[index] = answer;
            }
          }
        }
      }

      // Store backend session info if provided
      if (response.session) {
        session.backendSession = response.session;
      }

      session.currentState = {
        emote: response.emote || 'idle',
        message: response.message || 'Hello!',
        quickInputs: response.quickInputs || [],
        system: response.system || { active_item: 1, completed_item: null },
        isLoading: false
      };

      return session.currentState;
    } catch (error) {
      console.error('Chat service error:', error);
      session.currentState = {
        emote: 'confused',
        message: 'Sorry, I encountered an error. Please try again.',
        quickInputs: ['Try again', 'Help'],
        system: { active_item: 1, completed_item: null },
        isLoading: false
      };
      return session.currentState;
    }
  }

  getCurrentState(character) {
    if (!this.sessions[character]) {
      return this.getDefaultState();
    }
    return this.sessions[character].currentState;
  }

  getAgendaInfo(character) {
    if (!this.sessions[character]) {
      return { agendaItems: [], completedItems: [], currentItem: null, progressPercent: 0 };
    }

    const session = this.sessions[character];
    const activeItemIndex = session.currentState?.system?.active_item ? 
      session.currentState.system.active_item - 1 : 0;
    
    const currentItem = session.agendaItems[activeItemIndex] || null;
    const completedCount = session.completedItems.filter(item => item !== null).length;
    const progressPercent = session.agendaItems.length > 0 ? 
      (completedCount / session.agendaItems.length) * 100 : 0;

    return {
      agendaItems: session.agendaItems,
      completedItems: session.completedItems,
      currentItem,
      progressPercent: Math.round(progressPercent)
    };
  }

  // Check if any character has completed agenda
  hasCompletedAgenda() {
    const characters = ['minu', 'mora', 'tula'];
    return characters.some(char => {
      const agendaInfo = this.getAgendaInfo(char);
      return agendaInfo.progressPercent === 100 && agendaInfo.agendaItems.length > 0;
    });
  }

  // Get first completed character's data
  getCompletedAgendaData() {
    const characters = ['minu', 'mora', 'tula'];
    for (const char of characters) {
      const agendaInfo = this.getAgendaInfo(char);
      if (agendaInfo.progressPercent === 100 && agendaInfo.agendaItems.length > 0) {
        return { character: char, ...agendaInfo };
      }
    }
    return null;
  }

  // Refresh agenda completion status from backend session
  async refreshAgendaStatus(character) {
    if (!this.sessions[character] || !this.sessions[character].courseId) {
      return;
    }

    const session = this.sessions[character];
    if (!session.backendSession) {
      return;
    }

    try {
      // For now, we rely on the completion data we get from chat responses
      // In the future, we could add a dedicated endpoint to refresh session status
      console.log('Agenda status refresh - using cached session data');
    } catch (error) {
      console.error('Error refreshing agenda status:', error);
    }
  }

  // Get the backend session ID for a character
  getSessionId(character) {
    if (!this.sessions[character] || !this.sessions[character].backendSession) {
      return null;
    }
    return this.sessions[character].backendSession.id;
  }

  // Check if a session is completed
  isSessionComplete(character) {
    const agendaInfo = this.getAgendaInfo(character);
    return agendaInfo.progressPercent === 100 && agendaInfo.agendaItems.length > 0;
  }
}

export const chatService = new ChatService();