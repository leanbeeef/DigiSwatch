// site.js

/* *********************************
   Theme Management Module
********************************* */

const ThemeManager = (() => {
    const defaultTheme = 'theme-light';

    // Function to apply the selected theme
    const applyTheme = (theme) => {
        // Remove existing theme classes
        document.body.classList.remove('theme-light', 'theme-dark');
        // Add the new theme class
        document.body.classList.add(theme);
        // Save the selected theme to localStorage
        localStorage.setItem('theme', theme);
        // Dispatch a custom event if needed
        const event = new CustomEvent('themeChange', { detail: { theme } });
        window.dispatchEvent(event);
    };

    // Function to initialize the theme on page load
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') || defaultTheme;
        applyTheme(savedTheme);
        // Set the theme selector value if it exists
        const themeSelector = document.getElementById('theme-selector');
        if (themeSelector) {
            themeSelector.value = savedTheme;
        }
    };

    return {
        applyTheme,
        initTheme,
    };
})();

/* *********************************
   Language Management Module
********************************* */

const LanguageManager = (() => {
    const defaultLanguage = 'en';

    // Translation data
    const translations = {
        //English
        en: {
            title: 'Color Palette Generator',
            home: 'Home',
            language: 'Language',
            theme: 'Theme',
            accessibility_checker: 'Accessibility Checker',
            apply_suggested_color: 'Apply Suggested Color',
            accessibility_result: 'Accessibility Result',
            foreground_color: 'Foreground Color',
            background_color: 'Background Color',
            protanopia: 'Protanopia',
            deuteranopia: 'Deuteranopia',
            tritanopia: 'Tritanopia',
            achromatopsia: 'Achromatopsia',
            color_blindness_simulation: 'Color Blindness Simulation',
            choose_color: 'Choose a Base Color',
            choose_harmony: 'Choose a Color Harmony',
            select_palette: 'Select Palette',
            select_palette_description: 'Select a palette to see its description.',
            export_as: 'Export as:',
            select_format: 'Select format',
            export_palette: 'Export Palette',
            generate_random_palette: 'Generate Random Palette',
            select_popular_palette: 'Select a Popular Palette',
            color_harmony_visualizer: 'Color Harmony Visualizer',
            select_pattern: 'Select Pattern:',
            button_example: 'Button Example',
            text_example: 'Text Example',
            preview_text: 'This is a preview of your text.',
            adjust_color: 'Adjust Color',
            hue: 'Hue:',
            jigsaw: 'Jigsaw',
            topography: 'Topography',
            overcast: 'Overcast',
            plus: 'Plus',
            bubbles: 'Bubbles',
            saturation: 'Saturation:',
            lightness: 'Lightness:',
            apply: 'Apply',
            default_theme: 'Default',
            light_theme: 'Light',
            dark_theme: 'Dark',
            english: 'English',
            spanish: 'Spanish',
            german: 'German',
            chinese_simplified: 'Chinese (Simplified)',
            japanese: 'Japanese',
            monochromatic: 'Monochromatic',
            analogous: 'Analogous',
            complementary: 'Complementary',
            split_complementary: 'Split Complementary',
            triadic: 'Triadic',
            tetradic: 'Tetradic',
            powerpoint_theme: 'PowerPoint Theme'
        },
        // Spanish
        es: {
            title: 'Generador de Paletas de Colores',
            home: 'Inicio',
            language: 'Idioma',
            theme: 'Tema',
            accessibility_checker: 'Comprobador de Accesibilidad',
            apply_suggested_color: 'Aplicar Color Sugerido',
            accessibility_result: 'Resultado de Accesibilidad',
            foreground_color: 'Color de Primer Plano',
            background_color: 'Color de Fondo',
            protanopia: 'Protanopia',
            deuteranopia: 'Deuteranopia',
            tritanopia: 'Tritanopia',
            achromatopsia: 'Acromatopsia',
            color_blindness_simulation: 'Simulación de Daltonismo',
            choose_color: 'Elegir un Color Base',
            choose_harmony: 'Elegir una Armonía de Color',
            select_palette: 'Seleccionar Paleta',
            select_palette_description: 'Selecciona una paleta para ver su descripción.',
            export_as: 'Exportar como:',
            select_format: 'Seleccionar formato',
            export_palette: 'Exportar Paleta',
            generate_random_palette: 'Generar Paleta Aleatoria',
            select_popular_palette: 'Seleccionar una Paleta Popular',
            color_harmony_visualizer: 'Visualizador de Armonía de Color',
            select_pattern: 'Seleccionar Patrón:',
            button_example: 'Ejemplo de Botón',
            text_example: 'Ejemplo de Texto',
            preview_text: 'Esta es una vista previa de tu texto.',
            adjust_color: 'Ajustar Color',
            hue: 'Matiz:',
            jigsaw: 'Rompecabezas',
            topography: 'Topografía',
            overcast: 'Nublado',
            plus: 'Más',
            bubbles: 'Burbujas',
            saturation: 'Saturación:',
            lightness: 'Luminosidad:',
            apply: 'Aplicar',
            default_theme: 'Predeterminado',
            light_theme: 'Claro',
            dark_theme: 'Oscuro',
            english: 'Inglés',
            spanish: 'Español',
            german: 'Alemán',
            chinese_simplified: 'Chino (Simplificado)',
            japanese: 'Japonés',
            monochromatic: 'Monocromático',
            analogous: 'Análogo',
            complementary: 'Complementario',
            split_complementary: 'Complementario Dividido',
            triadic: 'Triádico',
            tetradic: 'Tetrádico',
            powerpoint_theme: 'Tema de PowerPoint'
        },

        // French
        fr: {
            title: 'Générateur de Palette de Couleurs',
            home: 'Accueil',
            language: 'Langue',
            theme: 'Thème',
            accessibility_checker: 'Vérificateur d\'Accessibilité',
            apply_suggested_color: 'Appliquer la Couleur Suggérée',
            accessibility_result: 'Résultat d\'Accessibilité',
            foreground_color: 'Couleur de Premier Plan',
            background_color: 'Couleur de Fond',
            protanopia: 'Protanopie',
            deuteranopia: 'Deutéranopie',
            tritanopia: 'Tritanopie',
            achromatopsia: 'Achromatopsie',
            color_blindness_simulation: 'Simulation du Daltonisme',
            choose_color: 'Choisir une Couleur de Base',
            choose_harmony: 'Choisir une Harmonie de Couleur',
            select_palette: 'Sélectionner la Palette',
            select_palette_description: 'Sélectionnez une palette pour voir sa description.',
            export_as: 'Exporter comme:',
            select_format: 'Sélectionner le format',
            export_palette: 'Exporter la Palette',
            generate_random_palette: 'Générer une Palette Aléatoire',
            select_popular_palette: 'Sélectionner une Palette Populaire',
            color_harmony_visualizer: 'Visualiseur d\'Harmonie de Couleur',
            select_pattern: 'Sélectionner le Motif:',
            button_example: 'Exemple de Bouton',
            text_example: 'Exemple de Texte',
            preview_text: 'Ceci est un aperçu de votre texte.',
            adjust_color: 'Ajuster la Couleur',
            hue: 'Teinte:',
            jigsaw: 'Puzzle',
            topography: 'Topographie',
            overcast: 'Couvert',
            plus: 'Plus',
            bubbles: 'Bulles',
            saturation: 'Saturation:',
            lightness: 'Lumière:',
            apply: 'Appliquer',
            default_theme: 'Défaut',
            light_theme: 'Clair',
            dark_theme: 'Sombre',
            english: 'Anglais',
            spanish: 'Espagnol',
            german: 'Allemand',
            chinese_simplified: 'Chinois (Simplifié)',
            japanese: 'Japonais',
            monochromatic: 'Monochromatique',
            analogous: 'Analogue',
            complementary: 'Complémentaire',
            split_complementary: 'Complémentaire Divisé',
            triadic: 'Triadique',
            tetradic: 'Tétradique',
            powerpoint_theme: 'Thème PowerPoint'
        },

        // German
        de: {
            title: 'Farbpalettengenerator',
            home: 'Startseite',
            language: 'Sprache',
            theme: 'Thema',
            accessibility_checker: 'Barrierefreiheitsprüfung',
            apply_suggested_color: 'Empfohlene Farbe Anwenden',
            accessibility_result: 'Ergebnis der Barrierefreiheit',
            foreground_color: 'Vordergrundfarbe',
            background_color: 'Hintergrundfarbe',
            protanopia: 'Protanopie',
            deuteranopia: 'Deuteranopie',
            tritanopia: 'Tritanopie',
            achromatopsia: 'Achromatopsie',
            color_blindness_simulation: 'Farbenblindheitssimulation',
            choose_color: 'Wählen Sie eine Basisfarbe',
            choose_harmony: 'Wählen Sie eine Farbharmonie',
            select_palette: 'Palette auswählen',
            select_palette_description: 'Wählen Sie eine Palette, um deren Beschreibung anzuzeigen.',
            export_as: 'Exportieren als:',
            select_format: 'Format wählen',
            export_palette: 'Palette exportieren',
            generate_random_palette: 'Zufällige Palette generieren',
            select_popular_palette: 'Beliebte Palette auswählen',
            color_harmony_visualizer: 'Farbharmonie-Visualizer',
            select_pattern: 'Muster auswählen:',
            button_example: 'Beispiel für Taste',
            text_example: 'Beispiel für Text',
            preview_text: 'Dies ist eine Vorschau Ihres Textes.',
            adjust_color: 'Farbe anpassen',
            hue: 'Farbton:',
            jigsaw: 'Puzzle',
            topography: 'Topografie',
            overcast: 'Bewölkt',
            plus: 'Plus',
            bubbles: 'Blasen',
            saturation: 'Sättigung:',
            lightness: 'Helligkeit:',
            apply: 'Anwenden',
            default_theme: 'Standard',
            light_theme: 'Hell',
            dark_theme: 'Dunkel',
            english: 'Englisch',
            spanish: 'Spanisch',
            german: 'Deutsch',
            chinese_simplified: 'Chinesisch (Vereinfacht)',
            japanese: 'Japanisch',
            monochromatic: 'Monochromatisch',
            analogous: 'Analog',
            complementary: 'Komplementär',
            split_complementary: 'Geteiltes Komplementär',
            triadic: 'Triadisch',
            tetradic: 'Tetradisch',
            powerpoint_theme: 'PowerPoint-Thema'
        },

        // Chinese (Simplified)
        zh: {
            title: '调色板生成器',
            home: '首页',
            language: '语言',
            theme: '主题',
            accessibility_checker: '无障碍检查',
            apply_suggested_color: '应用推荐颜色',
            accessibility_result: '无障碍结果',
            foreground_color: '前景色',
            background_color: '背景色',
            protanopia: '红色色盲',
            deuteranopia: '绿色色盲',
            tritanopia: '蓝色色盲',
            achromatopsia: '全色盲',
            color_blindness_simulation: '色盲模拟',
            choose_color: '选择基础颜色',
            choose_harmony: '选择色彩和谐',
            select_palette: '选择调色板',
            select_palette_description: '选择调色板以查看其描述。',
            export_as: '导出为：',
            select_format: '选择格式',
            export_palette: '导出调色板',
            generate_random_palette: '生成随机调色板',
            select_popular_palette: '选择流行调色板',
            color_harmony_visualizer: '色彩和谐可视化',
            select_pattern: '选择模式：',
            button_example: '按钮示例',
            text_example: '文本示例',
            preview_text: '这是你的文本预览。',
            adjust_color: '调整颜色',
            hue: '色调：',
            jigsaw: '拼图',
            topography: '地形图',
            overcast: '阴天',
            plus: '加号',
            bubbles: '气泡',
            saturation: '饱和度：',
            lightness: '亮度：',
            apply: '应用',
            default_theme: '默认',
            light_theme: '浅色',
            dark_theme: '深色',
            english: '英语',
            spanish: '西班牙语',
            german: '德语',
            chinese_simplified: '中文（简体）',
            japanese: '日语',
            monochromatic: '单色',
            analogous: '类似色',
            complementary: '互补色',
            split_complementary: '分割互补',
            triadic: '三分法',
            tetradic: '四分法',
            powerpoint_theme: 'PowerPoint主题'
        },

        // Japanese
        ja: {
            title: 'カラーパレットジェネレーター',
            home: 'ホーム',
            language: '言語',
            theme: 'テーマ',
            accessibility_checker: 'アクセシビリティチェッカー',
            apply_suggested_color: '推奨色を適用',
            accessibility_result: 'アクセシビリティの結果',
            foreground_color: '前景色',
            background_color: '背景色',
            protanopia: '赤色色盲',
            deuteranopia: '緑色色盲',
            tritanopia: '青色色盲',
            achromatopsia: '全色盲',
            color_blindness_simulation: '色覚異常シミュレーション',
            choose_color: '基本色を選択',
            choose_harmony: 'カラー調和を選択',
            select_palette: 'パレットを選択',
            select_palette_description: 'パレットを選択して説明を表示します。',
            export_as: '形式でエクスポート:',
            select_format: '形式を選択',
            export_palette: 'パレットをエクスポート',
            generate_random_palette: 'ランダムパレットを生成',
            select_popular_palette: '人気のパレットを選択',
            color_harmony_visualizer: 'カラー調和ビジュアライザー',
            select_pattern: 'パターンを選択:',
            button_example: 'ボタンの例',
            text_example: 'テキストの例',
            preview_text: 'これはあなたのテキストのプレビューです。',
            adjust_color: '色を調整',
            hue: '色相：',
            jigsaw: 'ジグソー',
            topography: '地形',
            overcast: '曇り',
            plus: 'プラス',
            bubbles: 'バブル',
            saturation: '彩度：',
            lightness: '明度：',
            apply: '適用',
            default_theme: 'デフォルト',
            light_theme: 'ライト',
            dark_theme: 'ダーク',
            english: '英語',
            spanish: 'スペイン語',
            german: 'ドイツ語',
            chinese_simplified: '中国語（簡体字）',
            japanese: '日本語',
            monochromatic: '単色',
            analogous: '類似色',
            complementary: '補色',
            split_complementary: '分割補色',
            triadic: '三色法',
            tetradic: '四色法',
            powerpoint_theme: 'PowerPointテーマ'
        },
        // Add more languages as needed
    };

    // Function to apply the selected language
    const applyLanguage = (language) => {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach((el) => {
            const key = el.getAttribute('data-translate');
            if (translations[language] && translations[language][key]) {
                if (el.placeholder !== undefined) {
                    el.placeholder = translations[language][key];
                } else {
                    el.textContent = translations[language][key];
                }
            }
        });
        localStorage.setItem('language', language);
        // Dispatch a custom event if needed
        const event = new CustomEvent('languageChange', { detail: { language } });
        window.dispatchEvent(event);

        // Update the language selector value if it exists
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            languageSelector.value = language;
        }
    };

    // Function to initialize the language on page load
    const initLanguage = () => {
        const savedLanguage = localStorage.getItem('language') || defaultLanguage;
        applyLanguage(savedLanguage);
    };

    return {
        applyLanguage,
        initLanguage,
    };
})();

/* *********************************
   Initialization on Page Load
********************************* */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme and language
    ThemeManager.initTheme();
    LanguageManager.initLanguage();

    // Attach event listeners to theme and language selectors if they exist
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
        themeSelector.addEventListener('change', (e) => {
            ThemeManager.applyTheme(e.target.value);
        });
    }

    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('change', (e) => {
            LanguageManager.applyLanguage(e.target.value);
        });
    }
});
