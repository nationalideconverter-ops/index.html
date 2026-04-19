// 1. Supabase Initialization (አንተ በሰጠኸኝ ቁልፎች የተሰራ)
const SB_URL = "https://hvtcyenmhpllkccwgaiy.supabase.co";
const SB_KEY = "EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dGN5ZW5taHBsbGtjY3dnYWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1ODg0MzMsImV4cCI6MjA5MjE2NDQzM30.RQDZh_vC7tSSPYJKD_wQVkrYVi9OWbxkwOz4qD3zbO4";

// Supabase client መፍጠር
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

// 2. የክፍያ ቁጥር (Transaction ID) ወደ ዳታቤዝ መላኪያ
async function submitPayment() {
    const ref = document.getElementById('refInput').value.trim();
    if (!ref) {
        alert("እባክዎ መጀመሪያ የቴሌብር ትራንዛክሽን ቁጥሩን ያስገቡ!");
        return;
    }

    const { error } = await supabaseClient
        .from('payments')
        .insert([{ ref_number: ref, status: 'pending' }]);

    if (error) {
        alert("ስህተት፡ ይህ ቁጥር ተደግሟል ወይም ሲስተሙ አልሰራም።");
        console.error(error);
    } else {
        alert("የክፍያ ቁጥሩ ተልኳል! አስተዳዳሪው ሲያረጋግጥልዎት ፖይንት ይጨመርልዎታል።");
        document.getElementById('refInput').value = "";
    }
}

// 3. ሦስቱን ፎቶዎች አቀናጅቶ ካርድ የማውጣት ስራ
async function processAndDownload() {
    const fFile = document.getElementById('frontImg').files[0];
    const bFile = document.getElementById('backImg').files[0];
    const pFile = document.getElementById('profileImg').files[0];

    if (!fFile || !bFile || !pFile) {
        alert("እባክዎ ሦስቱንም ፎቶዎች (Front, Back, Profile) ይጫኑ!");
        return;
    }

    const canvas = document.getElementById('idCanvas');
    const ctx = canvas.getContext('2d');

    alert("ካርዱ እየተዘጋጀ ነው... እባክዎ ይጠብቁ።");

    // ምስሎችን ማንበቢያ ተግባር
    const loadImage = (file) => new Promise((res) => {
        const img = new Image();
        img.onload = () => res(img);
        img.src = URL.createObjectURL(file);
    });

    try {
        const imgFront = await loadImage(fFile);
        const imgBack = await loadImage(bFile);
        const imgProfile = await loadImage(pFile);

        // ካንቫሱን ማጽዳት (ነጭ ባግራውንድ)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // --- የካርድ አቀነባባበር (Template logic) ---
        // ማሳሰቢያ፡ ይህ ለጊዜው ምስሎቹን ጎን ለጎን ያደርጋቸዋል። 
        // 100% ፖስታ ቤትን ለማስመሰል የምናደርገውን የክሮፒንግ (Crop) ኮድ በቀጣይ እናስተካክላለን።

        // የፊት ገጽን በግራ በኩል ማስቀመጥ
        ctx.drawImage(imgFront, 10, 10, 485, 618);
        
        // የጀርባ ገጽን በቀኝ በኩል ማስቀመጥ
        ctx.drawImage(imgBack, 510, 10, 485, 618);

        // ፕሮፋይል ፎቶን ወይም QR መደራረብ ካስፈለገ እዚህ ጋር ይጨመራል

        // 4. ምስሉን ለተጠቃሚው ማውረድ
        const link = document.createElement('a');
        link.download = 'Fayda_Print_Ready.png';
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();

    } catch (e) {
        alert("ምስሎቹን በማዘጋጀት ላይ ስህተት ተፈጥሯል! እባክዎ ጥራታቸው የተጠበቀ ፎቶዎችን ይጠቀሙ።");
        console.error(e);
    }
}
