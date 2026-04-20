// OCR ላይብረሪ መጫኑን አረጋግጥ
const frontInput = document.getElementById('frontImg');
const backInput = document.getElementById('backImg');
const canvas = document.getElementById('idCanvas');
const ctx = canvas.getContext('2d');

// ይህ ፋንክሽን ነው ዋናውን ስራ የሚሰራው
async function processAndDownload() {
    if (!frontInput.files[0]) {
        alert("እባክህ መጀመሪያ ስክሪንሾቱን ጫን!");
        return;
    }

    const file = frontInput.files[0];
    
    // 1. መረጃውን አንብብ (OCR)
    const result = await Tesseract.recognize(file, 'amh+eng');
    const text = result.data.text;
    
    // መረጃዎችን ለይተን እናውጣ (Regex)
    const fan = text.match(/\b\d{15}\b/)?.[0] || "--- --- ---";
    const nameAmh = extractAmharicName(text); // ስም መፈለጊያ ፋንክሽን

    // 2. አዲሱን ካርድ መሳል (Template 3/4)
    drawFrontCard(nameAmh, fan, file);
}

function drawFrontCard(name, fan, photoFile) {
    // ካንቫሱን አጽዳ
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // ሀ. ዳራውን (Background) ሳል - እንደ ምስል 3
    ctx.fillStyle = "#f0f9ff"; // ለስላሳ ሰማያዊ
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // ለ. ባንዲራ እና ሎጎዎችን ጨምር
    // ctx.drawImage(flagImg, 20, 20, 80, 50);

    // ሐ. ጽሁፎችን በትክክለኛው ቦታ ጻፍ (ይህ ነው ትልቁ ልዩነት!)
    ctx.fillStyle = "black";
    ctx.font = "bold 30px 'Abyssinica SIL', sans-serif";
    ctx.fillText("ሙሉ ስም | Full Name", 380, 150);
    ctx.fillText(name, 380, 190); // ስሙን እዚህ ቦታ ላይ ይጽፈዋል
    
    ctx.font = "bold 25px monospace";
    ctx.fillText("FAN: " + fan, 380, 500); // FAN ቁጥሩን እዚህ ጋር

    // መ. ፎቶውን ከስክሪንሾቱ ላይ ቆርጦ ማውጣት
    const img = new Image();
    img.src = URL.createObjectURL(photoFile);
    img.onload = () => {
        // ፎቶውን ብቻ ቆርጦ (Crop) ካርዱ ላይ ያሳርፈዋል
        ctx.drawImage(img, 100, 150, 250, 300, 50, 150, 250, 300);
        
        // ለመውረድ ዝግጁ ነው
        downloadImage();
    };
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = 'fayda_custom_card.png';
    link.href = canvas.toDataURL();
    link.click();
}

// ስምን ለመለየት የሚረዳ ቀላል ፋንክሽን
function extractAmharicName(text) {
    const lines = text.split('\n');
    const index = lines.findIndex(l => l.includes("Full Name") || l.includes("ሙሉ ስም"));
    return lines[index + 1] ? lines[index + 1].trim() : "ያልታወቀ ስም";
}
