// 1. መቆጣጠሪያዎችን መጥራት
const frontInput = document.getElementById('frontImg');
const backInput = document.getElementById('backImg');
const profileInput = document.getElementById('profileImg');
const canvas = document.getElementById('idCanvas');
const ctx = canvas.getContext('2d');

// 2. ዳውንሎድ ቁልፉ ሲጫን የሚሰራ ፋንክሽን
async function processAndDownload() {
    if (!frontInput.files[0] || !backInput.files[0]) {
        alert("እባክህ ፊት እና ጀርባ ስክሪንሾቶችን ጫን!");
        return;
    }

    // ጽሁፍ የማንበብ ሂደት (OCR) - ስም እና FAN ቁጥር ለማውጣት
    const statusText = "እባክህ ትንሽ ጠብቅ... መረጃውን እያነበብኩ ነው";
    console.log(statusText);

    try {
        const frontFile = frontInput.files[0];
        const result = await Tesseract.recognize(frontFile, 'amh+eng');
        const extractedText = result.data.text;

        // መረጃዎቹን ለይቶ ማውጣት (Regex)
        const fanNumber = extractedText.match(/\b\d{15}\b/)?.[0] || "--- --- ---";
        const fullName = extractName(extractedText);

        // --- ሀ. የፊት ገጽን መሳል (Front Side) ---
        await drawFront(frontFile, fullName, fanNumber);
        downloadCanvas('Fayda_Front.png');

        // --- ለ. የጀርባ ገጽን መሳል (Back Side) ---
        setTimeout(async () => {
            await drawBack(backInput.files[0]);
            downloadCanvas('Fayda_Back.png');
        }, 1500);

    } catch (error) {
        console.error("ስህተት ተፈጥሯል:", error);
        alert("መረጃውን ማንበብ አልተቻለም። እባክህ ምስሉ ጥራት ያለው መሆኑን አረጋግጥ።");
    }
}

// --- የፊት ገጽ ዲዛይን (ምስል 3 እንዲሆን) ---
async function drawFront(file, name, fan) {
    const img = await loadImage(URL.createObjectURL(file));
    
    // 1. ካንቫሱን አጽዳና ነጭ ዳራ አድርግ
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. ፎቶውን መቁረጥ (Crop Profile Photo)
    // ስክሪንሾቱ ላይ ፎቶው ያለበትን ግምታዊ ቦታ ቆርጦ አዲሱ ካርድ ላይ ያሳርፋል
    // (እነዚህን ቁጥሮች እንደ ስክሪንሾቱ መጠን ልታስተካክላቸው ትችላለህ)
    ctx.drawImage(img, 280, 140, 440, 500, 60, 160, 260, 310);

    // 3. ጽሁፎችን መጻፍ
    ctx.fillStyle = "#000";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("ሙሉ ስም | Full Name", 350, 180);
    
    ctx.font = "bold 32px 'Abyssinica SIL', sans-serif";
    ctx.fillText(name, 350, 230); // ስሙን እዚህ ጋር ይጽፋል

    ctx.font = "bold 28px monospace";
    ctx.fillText(fan, 440, 550); // FAN ቁጥር ከባርኮዱ በላይ
}

// --- የጀርባ ገጽ ዲዛይን (ምስል 4 እንዲሆን) ---
async function drawBack(file) {
    const img = await loadImage(URL.createObjectURL(file));
    
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // QR ኮዱን ከስክሪንሾቱ ላይ ቆርጦ ማውጣት
    // (ምስል 2 ላይ QR ኮዱ ያለበትን ቦታ ይቆርጣል)
    ctx.drawImage(img, 80, 120, 850, 600, 420, 120, 520, 450);
}

// --- ረዳት ፋንክሽኖች ---

function loadImage(url) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = url;
    });
}

function downloadCanvas(filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function extractName(text) {
    const lines = text.split('\n');
    const index = lines.findIndex(l => l.includes("Full Name") || l.includes("ሙሉ ስም"));
    return lines[index + 1] ? lines[index + 1].trim() : "ያልታወቀ ስም";
}
