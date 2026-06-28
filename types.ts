
export interface HtmlElement {
  tag: string;
  content: string;
  id?: string;
  style?: string;
}

export interface AndroidWidget {
  type: 'text' | 'button' | 'input' | 'image' | 'card' | 'switch' | 'progress' | 'video' | 'audio' | 'gallery';
  id: string;
  label: string;
  style?: string;
  url?: string;
  value?: string | number;
}

export interface AndroidScreen {
  name: string;
  widgets: AndroidWidget[];
}

export interface AndroidAppResult {
  appName: string;
  packageName: string;
  screens: AndroidScreen[];
  builtTime: string;
  apkSize: string;
  apkName: string;
}

export interface GraphicalShape {
  type: 'circle' | 'rect' | 'line' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  x2?: number;
  y2?: number;
  radius?: number;
  color?: string;
  text?: string;
}

export interface GraphicalChart {
  type: 'bar' | 'line' | 'pie' | 'radar';
  labels: string[];
  data: number[];
  title?: string;
}

export interface PhysicsBody {
  id: string;
  type: 'circle' | 'rect';
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius?: number;
  width?: number;
  height?: number;
  mass: number;
  color: string;
  restitution: number;
}

export interface PhysicsSimulationResult {
  gravity: number;
  friction: number;
  restitution: number;
  bodies: PhysicsBody[];
  isRunning: boolean;
}

export interface ExecutionResult {
  output: string[];
  generatedImages?: string[]; // Base64 strings
  generatedAudio?: string[]; // Base64 strings (simulation or actual)
  generatedVideos?: { frames: string[], prompt: string }[]; // Video simulation (Frames)
  generatedHtmlElements?: HtmlElement[]; // Generated DOM elements for Web Preview
  generatedAndroidApp?: AndroidAppResult; // For simulated native Android rendering
  generatedGraphics?: {
    shapes?: GraphicalShape[];
    chart?: GraphicalChart;
    canvasActive: boolean;
  };
  generatedPhysics?: PhysicsSimulationResult; // For simulated physics laws and mechanics
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
  kotlin?: string;
  swift?: string;
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

export enum TokenType {
  VAR = 'VAR',
  PRINT = 'PRINT',
  IF = 'IF',
  ELSE = 'ELSE',
  FOR = 'FOR',
  IN = 'IN',
  RANGE = 'RANGE',
  REPEAT = 'REPEAT',
  TIMES = 'TIMES',
  FUNC = 'FUNC',
  MAIN = 'MAIN',
  CLASS = 'CLASS',
  EXTENDS = 'EXTENDS',
  END = 'END',
  IMPORT = 'IMPORT',
  TRY = 'TRY',
  CATCH = 'CATCH',
  THIS = 'THIS',
  NEW = 'NEW',
  IDENTIFIER = 'IDENTIFIER',
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  ASSIGN = 'ASSIGN',
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE',
  EQ = 'EQ',
  NEQ = 'NEQ',
  LT = 'LT',
  GT = 'GT',
  LTE = 'LTE',
  GTE = 'GTE',
  LPAREN = 'LPAREN',
  RPAREN = 'RPAREN',
  COMMA = 'COMMA',
  COLON = 'COLON',
  DOT = 'DOT',
  NEWLINE = 'NEWLINE',
  EOF = 'EOF'
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
}

export interface ASTNode {
  type: string;
  line: number;
  [key: string]: any;
}

export interface Diagnostic {
  severity: "error" | "warning" | "info";
  message: string;
  line: number;
  codeSnippet?: string;
  fixSuggestion?: {
    type: "replace" | "insert" | "delete";
    text: string;
    description: string;
  };
}
