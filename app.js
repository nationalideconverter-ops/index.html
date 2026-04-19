const SB_URL = "https://hvtcyenmhpllkccwgaiy.supabase.co";
const SB_KEY = "EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dGN5ZW5taHBsbGtjY3dnYWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1ODg0MzMsImV4cCI6MjA5MjE2NDQzM30.RQDZh_vC7tSSPYJKD_wQVkrYVi9OWbxkwOz4qD3zbO4";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

async function processAndDownload() {
    const fFile = document.getElementById('frontImg').files[0];
    const bFile = document.getElementById('backImg').files[0];
    const pFile = document.getElementById('profileImg').files[0];

    if (!fFile || !bFile || !pFile) return alert("እባክዎ ሦስቱንም ፎቶዎች ይጫኑ!");

    const canvas = document.getElementById('idCanvas');
    const ctx = canvas.getContext('2d');
    
    // የፖስታ ቤት ስታንዳርድ መጠን (Standard ID Size)
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
        const imgProfile = await loadImage(pFile);

        // 1. ባግራውንዱን ነጭ ማድረግ
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. የፊት ገጽ አቀነባባበር (Front Side Logic)
        // እዚህ ጋር ሲስተሙ ከስክሪንሾቱ ላይ መሃሉን ብቻ ቆርጦ ያወጣዋል
        ctx.drawImage(imgFront, 50, 150, 900, 400, 0, 0, 1011, 638);

        // 3. የጀርባ ገጽ አቀነባባበር (Back Side Logic)
        // አዲስ ካንቫስ ለጀርባው እንፈጥራለን ወይም በተለየ ፋይል እናወርደዋለን
        // ለጊዜው ግን የፊቱን ገጽ ፖስታ ቤት በሚያትመው ልክ አስተካክለነዋል

        const link = document.createElement('a');
        link.download = 'Fayda_Official_Print.png';
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
        
        alert("ካርዱ በፖስታ ቤት ስታንዳርድ ተዘጋጅቶ ወርዷል!");

    } catch (e) {
        alert("ስህተት ተፈጥሯል፣ እባክዎ እንደገና ይሞክሩ።");
    }
}
