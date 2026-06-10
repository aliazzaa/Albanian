
export interface HtmlElement {
  tag: string;
  content: string;
  id?: string;
  style?: string;
}

export interface ExecutionResult {
  output: string[];
  generatedImages?: string[]; // Base64 strings
  generatedAudio?: string[]; // Base64 strings (simulation or actual)
  generatedVideos?: { frames: string[], prompt: string }[]; // Video simulation (Frames)
  generatedHtmlElements?: HtmlElement[]; // Generated DOM elements for Web Preview
  error?: string;
}

export interface TranspilationResult {
  python: string;
  javascript: string;
  java: string;
  html: string;
  cpp?: string;
  csharp?: string;
  go?: string;
  rust?: string;
  php?: string;
}

export enum CodeMode {
  EDITOR = 'EDITOR',
  TRANSPILED = 'TRANSPILED',
}

export interface Example {
  title: string;
  code: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface DebugState {
  isDebugging: boolean;
  isPaused: boolean;
  currentLine: number | null;
  variables: Record<string, any>;
}

export interface RuntimeCallbacks {
  onOutput?: (log: string) => void;
  onDebugPause?: (line: number, scope: Record<string, any>) => Promise<void>;
}

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string; // Only for files
  children?: FileSystemItem[]; // Only for folders
  isOpen?: boolean; // UI state for folders
}
