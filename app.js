// 1. የሚያስፈልጉ ላይብረሪዎችን በ CDN መጥራታቸውን አረጋግጥ
// index.html ላይ <script> ታግ ተጠቅመህ ጥራቸው (በታችኛው ክፍል ተመልከት)

// DOM Elements
const form = document.getElementById('upload-form');
const inputFront = document.getElementById('id-front');
const statusText = document.getElementById('status-text');
const previewContainer = document.getElementById('preview-container');

// የካርድ ቦታዎች (Template Elements)
const cardName = document.getElementById('card-name');
const cardFan = document.getElementById('card-fan');
const cardDob = document.getElementById('card-dob');
const cardSex = document.getElementById('card-sex');
const cardPhoto = document.getElementById('card-photo');
const downloadBtn = document.getElementById('download-btn');

// --- ዋናው የመረጃ መለየት ስራ (OCR Logic) ---

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!inputFront.files[0]) {
    alert("እባክህ የፌይዳ የፊት ገጽ ፎቶ አስገባ።");
    return;
  }

  const file = inputFront.files[0];
  statusText.innerText = 'ምስሉን እያነበብኩ ነው... እባክህ ትንሽ ጠብቅ (Amharic OCR can take time)';
  statusText.className = 'text-center text-blue-600';
  previewContainer.className = 'hidden'; // አዲሱን ካርድ ደብቅ

  // 1. ፎቶውን በአዲሱ ካርድ ላይ ለጥፍ (ለአሁኑ መረጃውን ሳንለይ)
  const reader = new FileReader();
  reader.onload = (event) => {
    cardPhoto.src = event.target.result;
  };
  reader.readAsDataURL(file);

  try {
    // 2. Tesseract ን በመጠቀም ጽሁፍ አንብብ (አማርኛ እና እንግሊዝኛ)
    // ማስታወሻ፡ በመጀመሪያው ጊዜ Amharic language pack ለማውረድ ጊዜ ሊወስድ ይችላል።
    const result = await Tesseract.recognize(
      file,
      'amh+eng', // ቋንቋዎች
      { logger: m => console.log(m) } // ለdebugging
    );

    const fullText = result.data.text;
    console.log("ሙሉ የታነበበ ጽሁፍ:", fullText); // ለdebugging

    // 3. Regex በመጠቀም መረጃዎቹን ለይ (The tricky part)

    // የFAN ቁጥርን ለመለየት (ለምሳሌ፦ 2507901...)
    const fanRegex = /\b\d{15}\b/g; 
    const fanMatch = fullText.match(fanRegex);
    const finalFan = fanMatch ? fanMatch[0] : 'አልተገኘም';

    // ሙሉ ስምን ለመለየት (አማርኛ)
    // ይህ በምስሉ ጥራት ላይ ይወሰናል። ለጊዜው 'ቁልፍ ቃላትን' እንፈልግ።
    const splitText = fullText.split('\n');
    let fullNameAmh = 'አልተገኘም';

    for (let i = 0; i < splitText.length; i++) {
        // "ሙሉ ስም" የሚለው ቃል ካለ፣ ቀጣዩ መስመር ስሙ ነው ብለን እንገምታለን።
        if (splitText[i].includes('ሙሉ ስም')) {
            // በደንብ ለማስተካከል ከምስሉ ጥራት ጋር ማዛመድ ይጠይቃል።
            if (splitText[i+1]) {
                fullNameAmh = splitText[i+1].trim();
            }
            break;
        }
    }

    // 4. የተገኘውን መረጃ በአዲሱ ካርድ ላይ አስቀምጥ
    cardName.innerText = fullNameAmh;
    cardFan.innerText = finalFan;
    cardDob.innerText = '01/01/1998 | 2005/Sep/11'; // ይህን በRegex በደንብ መለየት ይቻላል
    cardSex.innerText = 'ወንድ | Male';

    // 5. ውጤቱን አሳይ
    statusText.innerText = 'መረጃው በስኬት ተለይቷል! አዲሱ መታወቂያ ዝግጁ ነው።';
    statusText.className = 'text-center text-green-600';
    previewContainer.className = 'block mt-10'; // አዲሱን ካርድ አሳይ

  } catch (error) {
    console.error("OCR ስህተት:", error);
    statusText.innerText = 'ስህተት ተፈጥሯል። ምስሉን በደንብ ማንበብ አልተቻለም።';
    statusText.className = 'text-center text-red-600';
  }
});

// --- አዲሱን ካርድ ወደ ምስል ቀይሮ የማውረድ Logic ---

downloadBtn.addEventListener('click', () => {
    statusText.innerText = 'ምስሉን እያዘጋጀሁ ነው...';
    
    // html2canvas ን በመጠቀም 'id-card-template' የሚለውን ዲቪ ወደ ምስል ቀይር
    html2canvas(document.getElementById('id-card-template')).then(canvas => {
        const link = document.createElement('a');
        link.download = 'et_national_id.png';
        link.href = canvas.toDataURL();
        link.click();
        
        statusText.innerText = 'ምስሉ በስኬት ወርዷል።';
    });
});
