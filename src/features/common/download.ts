export const download = (content: object, filename: string) => {
  const blob = new Blob([JSON.stringify(content, null, 4)], {
    type: 'application/json',
  });
  const a = document.createElement('a');
  a.href = window.URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  a.remove();
};
