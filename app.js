async function processAndDownload() {
    const fFile = document.getElementById('frontImg').files[0]; // የስም ገጽ
    const bFile = document.getElementById('backImg').files[0];  // የQR ገጽ
    const pFile = document.getElementById('profileImg').files[0]; // የፊት ፎቶ

    if (!fFile || !bFile || !pFile) return alert("እባክዎ ሦስቱንም ፎቶዎች ይጫኑ!");

    const canvas = document.getElementById('idCanvas');
    const ctx = canvas.getContext('2d');
    
    // የካርድ መጠን (CR80 Standard)
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

        // --- 1. የፊት ገጽ (FRONT SIDE) ---
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // ዋናውን መረጃ ከስክሪንሾቱ ላይ ቆርጦ Landscape ማድረግ
        // በምስል 3 ላይ እንዳለው አቀማመጥ
        ctx.drawImage(imgFront, 0, 520, imgFront.width, 950, 0, 0, 1011, 638);
        
        // ጽሁፉ በደንብ እንዲታይ Contrast መጨመር
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(imgFront, 0, 520, imgFront.width, 950, 0, 0, 1011, 638);
        ctx.globalCompositeOperation = 'source-over';

        downloadCanvas('Fayda_Front_Official.png');

        // --- 2. የጀርባ ገጽ (BACK SIDE) ---
        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // የጀርባውን QR እና መረጃ መቁረጥ (በምስል 4 ላይ እንዳለው)
            ctx.drawImage(imgBack, 0, 520, imgBack.width, 950, 0, 0, 1011, 638);
            
            // ጽሁፉን የማጥቆር ስራ
            ctx.globalCompositeOperation = 'multiply';
            ctx.drawImage(imgBack, 0, 520, imgBack.width, 950, 0, 0, 1011, 638);
            ctx.globalCompositeOperation = 'source-over';

            downloadCanvas('Fayda_Back_Official.png');
            alert("100% ተመሳስሎ ተሰርቷል! አሁን ማተም ትችላለህ።");
        }, 1500);

    } catch (e) {
        alert("ስህተት ተፈጥሯል፤ እባክዎ ፎቶዎቹን በትክክል ይጫኑ።");
    }
}

function downloadCanvas(name) {
    const canvas = document.getElementById('idCanvas');
    const link = document.createElement('a');
    link.download = name;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
}
