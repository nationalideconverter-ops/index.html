const SB_URL = "https://hvtcyenmhpllkccwgaiy.supabase.co";
const SB_KEY = "EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dGN5ZW5taHBsbGtjY3dnYWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1ODg0MzMsImV4cCI6MjA5MjE2NDQzM30.RQDZh_vC7tSSPYJKD_wQVkrYVi9OWbxkwOz4qD3zbO4";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

async function processAndDownload() {
    const fFile = document.getElementById('frontImg').files[0];
    const bFile = document.getElementById('backImg').files[0];

    if (!fFile || !bFile) return alert("እባክዎ የፊትና የጀርባ ስክሪንሾቶችን ይጫኑ!");

    const canvas = document.getElementById('idCanvas');
    const ctx = canvas.getContext('2d');
    
    // የፖስታ ቤት ስታንዳርድ (Landscape)
    canvas.width = 1011; 
    canvas.height = 638;

    const loadImage = (file) => new Promise((res) => {
        const img = new Image();
        img.onload = () => res(img);
        img.src = URL.createObjectURL(file);
    });

    try {
        const imgFront = await loadImage(fFile);
        const imgBack = await loadImage(bFile);

        // --- 1. የፊት ገጽን ማዘጋጀት (Landscape) ---
        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // ምስሉን አዙሮ መሃል ላይ መቁረጥ
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.rotate(Math.PI / 180 * 0); // እዚህ ጋር ምስሉን እንደ አስፈላጊነቱ ማዞር ይቻላል
        ctx.drawImage(imgFront, 0, 0, imgFront.width, imgFront.height, -505, -319, 1011, 638);
        ctx.restore();
        downloadCanvas('Fayda_Front_Landscape.png');

        // --- 2. የጀርባ ገጽን ማዘጋጀት (Landscape) ---
        setTimeout(() => {
            ctx.save();
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.translate(canvas.width/2, canvas.height/2);
            ctx.drawImage(imgBack, 0, 0, imgBack.width, imgBack.height, -505, -319, 1011, 638);
            ctx.restore();
            downloadCanvas('Fayda_Back_Landscape.png');
            alert("ስራው ተጠናቋል! ሁለቱም ገጾች Landscape ሆነው ወርደዋል።");
        }, 1500);

    } catch (e) {
        alert("ስህተት ተፈጥሯል!");
    }
}

function downloadCanvas(name) {
    const canvas = document.getElementById('idCanvas');
    const link = document.createElement('a');
    link.download = name;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
}
