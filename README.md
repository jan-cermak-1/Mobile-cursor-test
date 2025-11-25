# 🎮 Tetris - Mobilní Webová Hra

Klasická hra Tetris optimalizovaná pro hraní na mobilních zařízeních v prohlížeči.

## 🚀 Jak spustit hru lokálně

1. Naklonujte tento repozitář:
   ```bash
   git clone https://github.com/jan-cermak-1/Mobile-cursor-test.git
   ```

2. Otevřete soubor `index.html` v prohlížeči

3. Nebo použijte lokální server (doporučeno):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (s http-server)
   npx http-server
   ```

4. Otevřete v prohlížeči: `http://localhost:8000`

## 🌐 Aktivace GitHub Pages (veřejná URL)

Aby byla hra dostupná na veřejné URL `https://jan-cermak-1.github.io/Mobile-cursor-test/`, je potřeba aktivovat GitHub Pages:

### Krok 1: Přejděte do nastavení repozitáře
Otevřete tento odkaz v prohlížeči:
```
https://github.com/jan-cermak-1/Mobile-cursor-test/settings/pages
```

### Krok 2: Nastavte zdroj pro GitHub Pages
1. V sekci **"Source"** vyberte:
   - **Deploy from a branch** (nebo "Nasadit z branchu")
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)` nebo `/`

2. Klikněte na tlačítko **Save** (Uložit)

### Krok 3: Počkejte na nasazení
- GitHub Pages se aktivuje během 1-2 minut
- Po aktivaci bude hra dostupná na: `https://jan-cermak-1.github.io/Mobile-cursor-test/`
- Status nasazení můžete sledovat v sekci **"Pages"** v nastavení repozitáře

### ⚠️ Důležité poznámky
- **Mobilní aplikace GitHubu** neumožňuje aktivovat GitHub Pages - je potřeba použít webové rozhraní
- Po aktivaci se hra automaticky aktualizuje při každém pushnutí do `main` branchu
- Pokud se stránka nezobrazí, počkejte několik minut - první nasazení může trvat déle

## 🎯 Jak hrát

### Na mobilu (dotykové ovládání):
- **Swipe vlevo/vpravo** - pohyb kusu
- **Swipe nahoru** - rotace kusu
- **Swipe dolů** - rychlý pád
- **Tlačítka** - použijte tlačítka pod hracím polem

### Na počítači (klávesnice):
- **← →** - pohyb kusu vlevo/vpravo
- **↑ nebo mezerník** - rotace kusu
- **↓** - pád kusu
- **P** - pauza

## 🎮 Pravidla hry

- Skládejte řádky z padajících kamenů
- Kompletní řádky se automaticky smažou
- Za každý smazaný řádek získáváte body
- Úroveň se zvyšuje každých 10 smazaných řádků
- Hra končí, když se kameny nahromadí až nahoru

## 📊 Bodování

- **1 řádek**: 100 × úroveň bodů
- **2 řádky**: 300 × úroveň bodů
- **3 řádky**: 500 × úroveň bodů
- **4 řádky**: 800 × úroveň bodů (Tetris!)

## 🛠️ Technologie

- **HTML5** - struktura
- **CSS3** - styling a responzivní design
- **JavaScript (Vanilla)** - herní logika
- **Canvas API** - vykreslování hry

## 📱 Kompatibilita

- ✅ Mobilní prohlížeče (Chrome, Safari, Firefox)
- ✅ Desktop prohlížeče
- ✅ Tablety
- ✅ Touch zařízení

## 📝 Struktura projektu

```
.
├── index.html      # Hlavní HTML soubor
├── style.css      # Styly a responzivní design
├── game.js        # Herní logika
└── README.md      # Tento soubor
```

## 🔄 Automatické nasazení

Repozitář obsahuje GitHub Actions workflow, který automaticky:
- Vytvoří `gh-pages` branch při pushnutí do `main`
- Nasadí hru na GitHub Pages

Workflow soubory:
- `.github/workflows/pages.yml` - nasazení na gh-pages branch
- `.github/workflows/setup-pages.yml` - automatická aktivace (vyžaduje manuální aktivaci první)

## 📞 Podpora

Pokud máte problémy s aktivací GitHub Pages:
1. Zkontrolujte, že máte přístup k nastavení repozitáře
2. Ujistěte se, že `gh-pages` branch existuje
3. Zkuste použít jiný prohlížeč nebo zařízení

---

**Užijte si hru! 🎮**
