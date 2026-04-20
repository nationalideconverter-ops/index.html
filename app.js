const downloadBtn = document.getElementById('download-btn');

downloadBtn.addEventListener('click', async () => {
    // 1. የፊት ገጹን (Front) ወደ ምስል ቀይርና አውርድ
    const frontCanvas = await html2canvas(document.getElementById('card-front-design'));
    const frontLink = document.createElement('a');
    frontLink.download = 'fayda_front.png';
    frontLink.href = frontCanvas.toDataURL();
    frontLink.click();

    // 2. ትንሽ ቆይተህ (ለምሳሌ 0.5 ሰከንድ) የጀርባ ገጹን (Back) አውርድ
    setTimeout(async () => {
        const backCanvas = await html2canvas(document.getElementById('card-back-design'));
        const backLink = document.createElement('a');
        backLink.download = 'fayda_back.png';
        backLink.href = backCanvas.toDataURL();
        backLink.click();
    }, 500);
});
