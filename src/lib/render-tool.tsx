import { Link } from 'react-router';
import { X } from 'lucide-react';
import { AiAssistant } from '@/components/tools/ai/ai-assistant';
import { ImageGenerator } from '@/components/tools/ai/image-generator';
import { Base64Tool } from '@/components/tools/encoders/base64-tool';
import { UrlTool } from '@/components/tools/encoders/url-tool';
import { ColorConverter } from '@/components/tools/converters/color-converter';
import { CurrencyConverter } from '@/components/tools/converters/currency-converter';
import { JsonCsvConverter } from '@/components/tools/converters/json-csv-converter';
import { CsvJsonConverter } from '@/components/tools/converters/csv-json-converter';
import { UnitConverter } from '@/components/tools/converters/unit-converter';
import { YamlParser } from '@/components/tools/converters/yaml-parser';
import { CaseConverter } from '@/components/tools/formatters/case-converter';
import { DiffChecker } from '@/components/tools/formatters/diff-checker';
import { JsonFormatter } from '@/components/tools/formatters/json-formatter';
import { JsonToTs } from '@/components/tools/formatters/json-to-ts';
import { MarkdownPreview } from '@/components/tools/formatters/markdown-preview';
import { SqlFormatter } from '@/components/tools/formatters/sql-formatter';
import { ColorPalette } from '@/components/tools/generators/color-palette';
import { LoremIpsum } from '@/components/tools/generators/lorem-ipsum';
import { PasswordGenerator } from '@/components/tools/generators/password-generator';
import { HashGenerator } from '@/components/tools/security/hash-generator';
import { JwtDebugger } from '@/components/tools/security/jwt-debugger';
import { CronParser } from '@/components/tools/utilities/cron-parser';
import { EmailPreviewer } from '@/components/tools/utilities/email-previewer';
import { EpochConverter } from '@/components/tools/utilities/epoch-converter';
import { HtmlPreviewer } from '@/components/tools/utilities/html-previewer';
import { JwtDecoder } from '@/components/tools/utilities/jwt-decoder';
import { Notes } from '@/components/tools/utilities/notes';
import { RegexTester } from '@/components/tools/utilities/regex-tester';
import { TimeCalculator } from '@/components/tools/utilities/time-calculator';
import { QrCodeGenerator } from '@/components/tools/visual/qr-code-generator';
import { Whiteboard } from '@/components/tools/visual/whiteboard';
import { Dashboard } from '@/components/tools/dashboard';

export function renderTool(id: string) {
  switch (id) {
    case 'dashboard':
      return <Dashboard />;
    case 'ai-assistant':
      return <AiAssistant />;
    case 'ai-image':
      return <ImageGenerator />;
    case 'whiteboard':
      return <Whiteboard />;
    case 'qr-generator':
      return <QrCodeGenerator />;
    case 'json-formatter':
      return <JsonFormatter />;
    case 'json-to-ts':
      return <JsonToTs />;
    case 'sql-formatter':
      return <SqlFormatter />;
    case 'base64':
      return <Base64Tool />;
    case 'password-generator':
      return <PasswordGenerator />;
    case 'url-encoder':
      return <UrlTool />;
    case 'jwt-debugger':
      return <JwtDebugger />;
    case 'case-converter':
      return <CaseConverter />;
    case 'color-converter':
      return <ColorConverter />;
    case 'unit-converter':
      return <UnitConverter />;
    case 'currency-converter':
      return <CurrencyConverter />;
    case 'regex-tester':
      return <RegexTester />;
    case 'hash-generator':
      return <HashGenerator />;
    case 'markdown-preview':
      return <MarkdownPreview />;
    case 'lorem-ipsum':
      return <LoremIpsum />;
    case 'yaml-parser':
      return <YamlParser />;
    case 'json-to-csv':
      return <JsonCsvConverter />;
    case 'csv-to-json':
      return <CsvJsonConverter />;
    case 'color-palette':
      return <ColorPalette />;
    case 'html-previewer':
      return <HtmlPreviewer />;
    case 'email-previewer':
      return <EmailPreviewer />;
    case 'diff-checker':
      return <DiffChecker />;
    case 'epoch-converter':
      return <EpochConverter />;
    case 'cron-parser':
      return <CronParser />;
    case 'jwt-decoder':
      return <JwtDecoder />;
    case 'notes':
      return <Notes />;
    case 'time-calculator':
      return <TimeCalculator />;
    default:
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-500 dark:text-zinc-500 space-y-4">
          <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
            <X className="w-8 h-8 opacity-20 text-zinc-900 dark:text-zinc-100" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-300">Tool Not Found</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">The tool you&apos;re looking for doesn&apos;t exist or is under maintenance.</p>
          </div>
          <Link
            to="/"
            className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>
      );
  }
}
