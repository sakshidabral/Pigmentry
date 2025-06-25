function addColorPicker() {
  const input = document.createElement("input");
  input.type = "color";
  input.className = "color-picker";
  document.getElementById("color-inputs").appendChild(input);
}

function checkHarmony() {
  const pickers = document.querySelectorAll('.color-picker');
  const colors = Array.from(pickers).map(p => p.value);

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `<h3>Selected Colors:</h3>`;

  colors.forEach(color => {
    const box = document.createElement("div");
    box.style.backgroundColor = color;
    box.style.width = "80px";
    box.style.height = "80px";
    box.style.display = "inline-block";
    box.style.marginRight = "10px";
    box.style.border = "2px solid #fff";
    resultDiv.appendChild(box);
  });

  // Updated match check
  let verdict = "Good Match 🎨";

  const isNeutral = (color) => {
    const hex = chroma(color).hex().toLowerCase();
    return ['#ffffff', '#000000', '#808080', '#f5f5f5'].includes(hex); // white, black, gray
  };

  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const c1 = colors[i];
      const c2 = colors[j];

      // Allow neutrals to bypass contrast check
      if (!(isNeutral(c1) || isNeutral(c2))) {
        if (chroma.contrast(c1, c2) < 2.5) {
          verdict = "Might Clash ❌";
        }
      }
    }
  }

  resultDiv.innerHTML += `<p><strong>Match verdict:</strong> ${verdict}</p>`;
}


function generateCombinations() {
  const baseColor = document.getElementById("single-color").value;
  const combDiv = document.getElementById("combinations");
  combDiv.innerHTML = "";



const base = chroma(baseColor).hex().toLowerCase();
const isWhite = base === "#ffffff";
const isBlack = base === "#000000";
const isGray = chroma(baseColor).luminance() > 0.3 && chroma(baseColor).luminance() < 0.7 && chroma(baseColor).saturation() < 0.1;

let combos = {};

if (isWhite || isBlack || isGray) {
  // Curated vibrant color sets for neutral base
  combos = {
    "2-Color Combo": [baseColor, "#FF4081"],                  // pink
    "3-Color Combo": [baseColor, "#03A9F4", "#FFC107"],       // blue + amber
    "4-Color Combo": [baseColor, "#8BC34A", "#FF5722", "#9C27B0"] // green, orange, purple
  };
} else {
  // Generate based on color theory
  combos = {
    "2-Color (Complementary)": [baseColor, chroma(baseColor).set('hsl.h', '+180').hex()],
    "3-Color (Analogous)": chroma
      .scale([
        chroma(baseColor).set('hsl.h', '-30'),
        baseColor,
        chroma(baseColor).set('hsl.h', '+30')
      ])
      .colors(3),
    "4-Color (Triadic)": [
      baseColor,
      chroma(baseColor).set('hsl.h', '+120').hex(),
      chroma(baseColor).set('hsl.h', '-120').hex(),
      chroma(baseColor).set('hsl.l', '*0.85').hex()
    ]
  };
}



  for (const [label, colorSet] of Object.entries(combos)) {
    const title = document.createElement("h4");
    title.innerText = label;
    combDiv.appendChild(title);

    const row = document.createElement("div");
    row.style.marginBottom = "10px";

    colorSet.forEach(color => {
      const box = document.createElement("div");
      box.style.backgroundColor = color;
      box.style.width = "80px";
      box.style.height = "80px";
      box.style.display = "inline-block";
      box.style.marginRight = "10px";
      box.title = color;
      row.appendChild(box);
    });

    combDiv.appendChild(row);
  }
}
