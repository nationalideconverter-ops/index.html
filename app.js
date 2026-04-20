// በ HTML ውስጥ ያሉ ክፍሎችን መጥራት
const frontInput = document.getElementById('frontImg');
const backInput = document.getElementById('backImg');
const profileInput = document.getElementById('profileImg');
const canvas = document.getElementById('idCanvas');
const ctx = canvas.getContext('2d');

async function processAndDownload() {
    // 1. ነጥብ ካለ ማረጋገጥ (ይህ ለወደፊት ከ Supabase ጋር የምታያይዘው ነው)
    // ለጊዜው ነጥብ ባይኖርም እንዲሰራ እናድርገው
    
    if (!frontInput.files[0] || !backInput.files[0] || !profileInput.files[0]) {
        alert("እባክህ ሶስቱንም ምስሎች (ፊት፣ ጀርባ እና ፕሮፋይል) ጫን!");
        return;
    }

    // 2. ምስሎቹን መጫን (Loading Images)
    const frontImg = await loadImage(URL.createObjectURL(frontInput.files[0]));
    const backImg = await loadImage(URL.createObjectURL(backInput.files[0]));
    const profileImg = await loadImage(URL.createObjectURL(profileInput.files[0]));

    // 3. በካንቫሱ ላይ መሳል (Drawing)
    // ካንቫሱን አጽዳ
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // --- ሀ. የፊት ገጽን መሳል (Front Side) ---
    // ለምሳሌ ከላይ ግማሽ ላይ የፊት ገጹን እናድርገው
    ctx.drawImage(frontImg, 50, 50, 430, 270); 

    // --- ለ. የጀርባ ገጽን መሳል (Back Side) ---
    // ከፊት ገጹ ጎን ወይም በታች
    ctx.drawImage(backImg, 530, 50, 430, 270);

    // --- ሐ. ፕሮፋይል/QR ፎቶውን መሳል ---
    // ይህ ምስል አዲሱ መታወቂያ ላይ እንዲቀመጥ የምትፈልገው ከሆነ
    ctx.drawImage(profileImg, 50, 350, 430, 270);

    // 4. ምስሉን ለሁለት ከፍሎ ማውረድ (Download)
    // መጀመሪያ የፊት ገጹን ብቻ የያዘ ምስል አውርድ
    downloadCanvasSegment(0, 0, 1011, 320, 'Fayda_Front_Print.png');
    
    // ትንሽ ቆይተህ የጀርባውን ክፍል አውርድ
    setTimeout(() => {
        downloadCanvasSegment(0, 320, 1011, 320, 'Fayda_Back_Print.png');
    }, 1000);
}

// ምስልን ከፋይል ወደ Image Object መቀየሪያ
function loadImage(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = url;
    });
}

// የተወሰነውን የካንቫስ ክፍል ብቻ ቆርጦ ማውረጃ
function downloadCanvasSegment(x, y, width, height, fileName) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
    
    const link = document.createElement('a');
    link.download = fileName;
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
}

// የክፍያ ስራ (Payment logic - ለወደፊት የምትሞላው)
function submitPayment() {
    const ref = document.getElementById('refInput').value;
    if (ref.length < 5) {
        alert("ትክክለኛ የትራንዛክሽን ቁጥር ያስገቡ!");
        return;
    }
    alert("ክፍያዎ ለፍተሻ ተልኳል! ቁጥሩ ሲረጋገጥ ነጥብ ይጨመርልዎታል።");
}
