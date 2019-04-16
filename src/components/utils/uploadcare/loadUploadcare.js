export const loadUploadcare = (callback) => {
  const existingScript = document.getElementById('uploadcare');

  if (!existingScript) {
    const script = document.createElement('script');
    script.src = 'https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js';
    script.id = 'uploadcare';
    document.body.appendChild(script);

    script.onload = () => {
      if (callback) callback();
    };
  }

  if (existingScript && callback) callback();
};