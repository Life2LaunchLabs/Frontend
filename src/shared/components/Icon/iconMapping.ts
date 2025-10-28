import {
  Mail01Icon,
  InstagramIcon,
  NewTwitterIcon,
  Globe02Icon,
  Settings02Icon,
} from 'hugeicons-react';

// Icon mapping: custom name -> { library, component/symbolName }
export const iconMapping = {
  // Hugeicons
  mail: { library: 'hugeicons', component: Mail01Icon },
  instagram: { library: 'hugeicons', component: InstagramIcon },
  twitter: { library: 'hugeicons', component: NewTwitterIcon },
  globe: { library: 'hugeicons', component: Globe02Icon },
  gears: { library: 'hugeicons', component: Settings02Icon },

  // Material Symbols (font-based)
  group: { library: 'material', symbolName: 'group' },
  play: { library: 'material', symbolName: 'person_play' },
  home: { library: 'material', symbolName: 'home' },
  chat: { library: 'material', symbolName: 'chat' },
  map: { library: 'material', symbolName: 'map' },
  search: { library: 'material', symbolName: 'search' },
} as const;

export type MappedIconName = keyof typeof iconMapping;
