// Supabase Configuration (ቁልፎቹን ከ Supabase Project Settings አምጣቸው)
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function processAndDownload() {
    const frontInput = document.getElementById('frontImg').files[0];
    const backInput = document.getElementById('backImg').files[0];
    const profileInput = document.getElementById('profileImg').files[0];

    if (!frontInput || !backInput) {
        alert("እባክህ የፊት እና የጀርባ ምስሎችን አስገባ!");
        return;
    }

    // 1. የፊት ገጹን ማዘጋጀት (Front Side)
    const frontCanvas = document.createElement('canvas');
    await processSide(frontCanvas, frontInput, "FRONT");
    downloadCanvas(frontCanvas, "Fayda_Front.png");

    // 2. የጀርባ ገጹን ማዘጋጀት (Back Side)
    const backCanvas = document.createElement('canvas');
    await processSide(backCanvas, backInput, "BACK");
    downloadCanvas(backCanvas, "Fayda_Back.png");
}

async function processSide(canvas, file, side) {
    const ctx = canvas.getContext('2d');
    canvas.width = 1011; // Standard ID Width
    canvas.height = 638; // Standard ID Height

    const img = await loadImage(file);

    // ነጭ ባግራውንድ መሳል
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (side === "FRONT") {
        // ከቁም ምስሉ ላይ መረጃ ያለበትን መካከለኛ ክፍል ቆርጦ አግድም ማድረግ
        // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        // እነዚህ ቁጥሮች (50, 400...) እንደ ስክሪንሾቱ መጠን ሊስተካከሉ ይችላሉ
        ctx.drawImage(img, 50, 450, 900, 600, 0, 0, 1011, 638);
    } else {
        // ለጀርባውም እንደዚሁ መካከለኛውን የ QR ክፍል መቁረጥ
        ctx.drawImage(img, 50, 50, 900, 600, 0, 0, 1011, 638);
    }
}

function loadImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function downloadCanvas(canvas, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
}

// ክፍያ ለማረጋገጥ (ለጊዜው ለሙከራ)
function submitPayment() {
    const ref = document.getElementById('refInput').value;
    if(ref.length > 5) {
        alert("ማረጋገጫው ተልኳል! በአጭር ጊዜ ውስጥ ፖይንት ይጨመርልዎታል።");
        document.getElementById('pointsDisplay').innerText = "Points: 10";
    }
}
