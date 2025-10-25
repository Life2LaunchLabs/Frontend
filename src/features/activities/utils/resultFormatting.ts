import { SubmissionDetails, SubmissionResponse } from '../api/ActivityResultsService';

type PrimitiveOption = {
  id?: string;
  value?: string;
  title?: string;
  label?: string;
  name?: string;
  description?: string;
  body?: string;
};

type PromptConfig = {
  id: string;
  title?: string;
  description?: string;
};

export interface NormalizedOption {
  id: string;
  title: string;
  description?: string;
}

export interface QuestionMetadata {
  questionId: string;
  questionType: string;
  title: string;
  options: NormalizedOption[];
  isMultiple: boolean;
  prompts: NormalizedOption[];
  positiveLabel?: string;
  negativeLabel?: string;
}

export type FormattedResponseValue =
  | { type: 'empty' }
  | { type: 'text'; text: string }
  | { type: 'option'; option: NormalizedOption }
  | { type: 'list'; items: NormalizedOption[] }
  | { type: 'prompts'; prompts: Array<{ prompt: NormalizedOption; answer: boolean | null; label: string }> }
  | { type: 'raw'; raw: string };

const normalizeOption = (option: PrimitiveOption): NormalizedOption | null => {
  if (!option) {
    return null;
  }

  const id = option.id ?? option.value ?? option.name;
  if (!id) {
    return null;
  }

  const title = option.title ?? option.label ?? option.name ?? String(id);
  const description = option.description ?? option.body;

  return {
    id: String(id),
    title: title || String(id),
    description: description || undefined,
  };
};

const normalizePrompt = (prompt: PromptConfig): NormalizedOption | null => {
  if (!prompt?.id) {
    return null;
  }

  return {
    id: String(prompt.id),
    title: prompt.title || String(prompt.id),
    description: prompt.description || undefined,
  };
};

const collectPages = (submissionDetails: SubmissionDetails): any[] => {
  const version = submissionDetails.activity_version as any;
  const meta = submissionDetails.meta || {};

  const pageSources = [
    version?.pages,
    version?.meta?.pages,
    meta?.activity_version?.pages,
    meta?.activity?.pages,
    meta?.activity_snapshot?.pages,
    meta?.activity_version_snapshot?.pages,
    meta?.pages,
    meta?.activity_pages,
  ];

  const pages: any[] = [];

  for (const source of pageSources) {
    if (!source) {
      continue;
    }

    if (Array.isArray(source)) {
      pages.push(...source);
    } else if (typeof source === 'object') {
      const nestedPages = (source as any)?.pages;
      if (Array.isArray(nestedPages)) {
        pages.push(...nestedPages);
      }
    }
  }

  return pages;
};

const collectBlocks = (page: any): any[] => {
  if (!page) {
    return [];
  }

  if (Array.isArray(page.blocks)) {
    return page.blocks;
  }

  if (Array.isArray(page.items)) {
    return page.items;
  }

  return [];
};

const extractOptions = (config: any, nestedConfig: any): NormalizedOption[] => {
  const optionSources: PrimitiveOption[][] = [];

  if (Array.isArray(config?.options)) {
    optionSources.push(config.options as PrimitiveOption[]);
  }

  if (Array.isArray(nestedConfig?.options)) {
    optionSources.push(nestedConfig.options as PrimitiveOption[]);
  }

  const options = new Map<string, NormalizedOption>();

  for (const source of optionSources) {
    for (const rawOption of source) {
      const normalized = normalizeOption(rawOption);
      if (normalized && !options.has(normalized.id)) {
        options.set(normalized.id, normalized);
      }
    }
  }

  return Array.from(options.values());
};

const extractPrompts = (config: any, nestedConfig: any): NormalizedOption[] => {
  const promptSources: PromptConfig[][] = [];

  if (Array.isArray(config?.prompts)) {
    promptSources.push(config.prompts as PromptConfig[]);
  }

  if (Array.isArray(nestedConfig?.prompts)) {
    promptSources.push(nestedConfig.prompts as PromptConfig[]);
  }

  const prompts = new Map<string, NormalizedOption>();

  for (const source of promptSources) {
    for (const rawPrompt of source) {
      const normalized = normalizePrompt(rawPrompt);
      if (normalized && !prompts.has(normalized.id)) {
        prompts.set(normalized.id, normalized);
      }
    }
  }

  return Array.from(prompts.values());
};

const getIsMultiple = (config: any, nestedConfig: any): boolean => {
  const maxSelect = nestedConfig?.max_select ?? config?.max_select;
  const explicitMultiple = nestedConfig?.multiple_selection ?? config?.multiple_selection;

  if (typeof explicitMultiple === 'boolean') {
    return explicitMultiple;
  }

  if (typeof maxSelect === 'number') {
    return maxSelect > 1;
  }

  return false;
};

export const buildQuestionMetadataMap = (
  submissionDetails?: SubmissionDetails | null
): Map<string, QuestionMetadata> => {
  const map = new Map<string, QuestionMetadata>();

  if (!submissionDetails) {
    return map;
  }

  const pages = collectPages(submissionDetails);

  for (const page of pages) {
    const blocks = collectBlocks(page);

    for (const block of blocks) {
      const config = block?.config || {};
      const questionId = config?.question_id;

      if (!questionId) {
        continue;
      }

      const nestedConfig = config?.config || {};
      const questionType = (config?.question_type || block?.block_type || '').toString();
      const title = config?.title || block?.title || questionId;

      const options = extractOptions(config, nestedConfig);
      const prompts = extractPrompts(config, nestedConfig);
      const isMultiple = getIsMultiple(config, nestedConfig);
      const positiveLabel = nestedConfig?.positive_label ?? config?.positive_label;
      const negativeLabel = nestedConfig?.negative_label ?? config?.negative_label;

      map.set(String(questionId), {
        questionId: String(questionId),
        questionType,
        title: title.toString(),
        options,
        isMultiple,
        prompts,
        positiveLabel: positiveLabel ? String(positiveLabel) : undefined,
        negativeLabel: negativeLabel ? String(negativeLabel) : undefined,
      });
    }
  }

  return map;
};

const extractSelectedIds = (value: any): string[] => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value ? [value] : [];
  }

  if (typeof value === 'object') {
    return Object.entries(value)
      .filter(([, selected]) => Boolean(selected))
      .map(([id]) => String(id));
  }

  return [];
};

export const getQuestionTitle = (
  response: SubmissionResponse,
  metadata?: QuestionMetadata
): string => {
  const fallbackTitle =
    metadata?.title ||
    response?.meta?.question_title ||
    response?.meta?.title ||
    response?.meta?.question_text ||
    response.question_id;

  return String(fallbackTitle);
};

export const formatResponseValue = (
  response: SubmissionResponse,
  metadata?: QuestionMetadata
): FormattedResponseValue => {
  const value = response?.value;

  if (value === null || value === undefined) {
    return { type: 'empty' };
  }

  const questionType = (metadata?.questionType || response.question_type || '').toLowerCase();

  if (questionType === 'text_input') {
    const textValue = typeof value === 'string' ? value.trim() : '';
    return textValue ? { type: 'text', text: textValue } : { type: 'empty' };
  }

  if (questionType === 'dropdown_input' || questionType === 'single_choice') {
    const [selectedId] = extractSelectedIds(value);

    if (!selectedId) {
      return { type: 'empty' };
    }

    const option = metadata?.options.find((opt) => opt.id === selectedId);

    if (option) {
      return { type: 'option', option };
    }

    return { type: 'text', text: selectedId };
  }

  if (questionType === 'multiple_choice') {
    const selectedIds = extractSelectedIds(value);

    if (selectedIds.length === 0) {
      return { type: 'empty' };
    }

    const items = selectedIds.map((id) => {
      const option = metadata?.options.find((opt) => opt.id === id);
      return option || { id, title: id };
    });

    if (metadata?.isMultiple || selectedIds.length > 1) {
      return { type: 'list', items };
    }

    return { type: 'option', option: items[0] };
  }

  if (questionType === 'a_or_b_input') {
    const answers = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    const prompts = metadata?.prompts || [];

    if (prompts.length === 0) {
      return { type: 'raw', raw: JSON.stringify(value, null, 2) };
    }

    const yesLabel = metadata?.positiveLabel || 'Yes';
    const noLabel = metadata?.negativeLabel || 'No';

    const promptAnswers = prompts.map((prompt) => {
      const rawAnswer = (answers as Record<string, boolean | null | undefined>)[prompt.id];
      let label = 'Skipped';

      if (rawAnswer === true) {
        label = yesLabel;
      } else if (rawAnswer === false) {
        label = noLabel;
      }

      return {
        prompt,
        answer: typeof rawAnswer === 'boolean' ? rawAnswer : null,
        label,
      };
    });

    return { type: 'prompts', prompts: promptAnswers };
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed ? { type: 'text', text: trimmed } : { type: 'empty' };
  }

  try {
    return { type: 'raw', raw: JSON.stringify(value, null, 2) };
  } catch (error) {
    return { type: 'raw', raw: String(value) };
  }
};
