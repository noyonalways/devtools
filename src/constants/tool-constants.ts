import { 
  Code2, 
  Hash, 
  Link2, 
  ShieldCheck, 
  Key, 
  Palette, 
  Ruler, 
  Search, 
  FileJson, 
  FileCode,
  Type,
  Lock,
  FileText,
  FileSpreadsheet,
  Text,
  Pipette,
  Monitor,
  Mail,
  ArrowRightLeft,
  Pencil,
  Sparkles,
  Image as ImageIcon,
  StickyNote,
  Timer,
  BadgeDollarSign,
  Database,
  QrCode,
  Clock,
  Calendar
} from 'lucide-react';
import { Tool } from '@/types/tool-types';

export const TOOLS: Tool[] = [
  {
    id: 'currency-converter',
    name: 'Currency Converter',
    description: 'Real-time exchange rates with market analysis charts.',
    icon: BadgeDollarSign,
    category: 'converters'
  },
  {
    id: 'time-calculator',
    name: 'Time & Date Calculator',
    description: 'Calculate time spans, count differences between dates, and manipulate timestamps.',
    icon: Timer,
    category: 'utilities'
  },
  {
    id: 'notes',
    name: 'Developer Notes',
    description: 'Quickly jot down ideas, snippets, or task lists with Markdown support.',
    icon: StickyNote,
    category: 'utilities'
  },
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    description: 'Ask questions, debug code, and get technical help from Gemini AI.',
    icon: Sparkles,
    category: 'ai'
  },
  {
    id: 'ai-image',
    name: 'AI Image Generator',
    description: 'Transform your text descriptions into unique, high-quality images.',
    icon: ImageIcon,
    category: 'ai'
  },
  {
    id: 'whiteboard',
    name: 'Planning Whiteboard',
    description: 'Sketch ideas, wireframes, and plan your next feature on a digital canvas.',
    icon: Pencil,
    category: 'visual'
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Beautify and standardize raw SQL queries.',
    icon: Database,
    category: 'formatters'
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate customizable QR codes for URLs and text.',
    icon: QrCode,
    category: 'visual'
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate and minify JSON data.',
    icon: FileJson,
    category: 'formatters'
  },
  {
    id: 'base64',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode data to/from Base64 format.',
    icon: Hash,
    category: 'encoders'
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Safely encode and decode URL parameters.',
    icon: Link2,
    category: 'encoders'
  },
  {
    id: 'jwt-debugger',
    name: 'JWT Debugger',
    description: 'Decode and inspect JSON Web Tokens.',
    icon: ShieldCheck,
    category: 'security'
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure, random passwords.',
    icon: Key,
    category: 'generators'
  },
  {
    id: 'color-converter',
    name: 'Color Converter',
    description: 'Convert between HEX, RGB, and HSL colors.',
    icon: Palette,
    category: 'converters'
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between px, rem, and em units.',
    icon: Ruler,
    category: 'converters'
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test and debug regular expressions.',
    icon: Search,
    category: 'utilities'
  },
  {
    id: 'markdown-preview',
    name: 'Markdown Preview',
    description: 'Live preview for Markdown content.',
    icon: FileCode,
    category: 'formatters'
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text between different cases.',
    icon: Type,
    category: 'formatters'
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256 hashes.',
    icon: Lock,
    category: 'security'
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text of customizable length.',
    icon: Text,
    category: 'generators'
  },
  {
    id: 'yaml-parser',
    name: 'YAML Parser',
    description: 'Convert between YAML and JSON formats.',
    icon: FileText,
    category: 'converters'
  },
  {
    id: 'json-to-csv',
    name: 'JSON to CSV',
    description: 'Convert JSON data to CSV format.',
    icon: FileSpreadsheet,
    category: 'converters'
  },
  {
    id: 'csv-to-json',
    name: 'CSV to JSON',
    description: 'Convert CSV data to JSON array of objects.',
    icon: FileJson,
    category: 'converters'
  },
  {
    id: 'color-palette',
    name: 'Color Palette Generator',
    description: 'Generate and save color palettes from a seed color.',
    icon: Pipette,
    category: 'generators'
  },
  {
    id: 'html-previewer',
    name: 'HTML Previewer',
    description: 'Live preview for HTML and CSS code with responsive testing.',
    icon: Monitor,
    category: 'utilities'
  },
  {
    id: 'email-previewer',
    name: 'Email Previewer',
    description: 'Design and test responsive HTML email templates.',
    icon: Mail,
    category: 'utilities'
  },
  {
    id: 'diff-checker',
    name: 'Diff Checker',
    description: 'Compare two pieces of text and see the differences line by line.',
    icon: ArrowRightLeft,
    category: 'utilities'
  },
  {
    id: 'epoch-converter',
    name: 'Unix Epoch Converter',
    description: 'Convert between Unix timestamps and human-readable dates.',
    icon: Clock,
    category: 'utilities'
  },
  {
    id: 'cron-parser',
    name: 'Cron Expression Parser',
    description: 'Convert cron expressions to human-readable text.',
    icon: Calendar,
    category: 'utilities'
  },
  {
    id: 'json-to-ts',
    name: 'JSON to TypeScript',
    description: 'Convert JSON to TypeScript interfaces.',
    icon: Code2,
    category: 'formatters'
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Tokens.',
    icon: ShieldCheck,
    category: 'utilities'
  }
];
