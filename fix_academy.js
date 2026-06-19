const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components', 'BayanAcademy.tsx');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Original content length:', content.length);

// 1. Repair transition to ch-web
const targetRegex = /\},\s*[\s\S]*?ة الهيكل البرمجي دون الحاجة لملفات HTML و CSS منفصلة أو إطارات عمل كـ React و Angular التي تنهك متصفحات المستخدمين\./;
const replacement = `},
  {
    id: "ch-web",
    title: "الفصل الخامس: تطوير الويب ومستندات البيان المستقلة",
    icon: "Cpu",
    badge: "تطوير الويب فائق السرعة",
    lessons: [
      {
        id: "les-web-intro",
        title: "الجيل الجديد للويب وهيكلية المستندات المستقلة",
        shortDesc: "صناعة هياكل صفحات الويب والواجهات الحية التفاعلية دون حشو.",
        concept: \\\`تتيح لغة البيان برمجة وتنمية واجهات الويب خفيفة الوزن ذاتياً، بهندسة الهيكل البرمجي دون الحاجة لملفات HTML و CSS منفصلة أو إطارات عمل كـ React و Angular التي تنهك متصفحات المستخدمين.\\\``.replace(/\\\\\\`/g, '`');

if (targetRegex.test(content)) {
  content = content.replace(targetRegex, replacement);
  console.log('Successfully repaired ch-web transition!');
} else {
  console.log('Failed to find ch-web transition pattern!');
}

// 2. Remove secondary duplicate ch-quantum
// We find where ch-quantum with "الفصل الخامس" starts, and clear up to ch-security
const dupQuantumRegex = /\{\s*id:\s*"ch-quantum"[\s\S]*?title:\s*"الفصل الخامس: المعالجة الكمومية[\s\S]*?\}\s*\]\s*\}\s*\]\s*\},\s*(?=\s*\{\s*id:\s*"ch-security")/g;

if (dupQuantumRegex.test(content)) {
  content = content.replace(dupQuantumRegex, '');
  console.log('Successfully removed duplicate ch-quantum!');
} else {
  console.log('Failed to find duplicate ch-quantum pattern!');
}

// Write the fixed content back
fs.writeFileSync(filePath, content, 'utf8');
console.log('Replacement finished. New content length:', content.length);
