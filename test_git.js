const { execSync } = require('child_process');
try {
  const status = execSync('git status', { encoding: 'utf8' });
  console.log('Git status:\n', status);
  
  // Show diff of components/BayanAcademy.tsx to see what was modified
  const diff = execSync('git diff components/BayanAcademy.tsx', { encoding: 'utf8' });
  console.log('Git diff length:', diff.length);
  
  // Let's revert the file to git HEAD
  execSync('git checkout -- components/BayanAcademy.tsx');
  console.log('Successfully reverted components/BayanAcademy.tsx to clean HEAD state!');
} catch (err) {
  console.error('Error running git commands:', err.message);
  if (err.stdout) console.log('Stdout:', err.stdout);
  if (err.stderr) console.log('Stderr:', err.stderr);
}
