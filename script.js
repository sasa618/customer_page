document.addEventListener('DOMContentLoaded', function() {
    const menuScreen = document.getElementById('menuScreen');
    const allergyScreen = document.getElementById('allergyScreen');

    const allergyTranslations = {
        egg: "卵",
        milk: "乳",
        wheat: "小麦",
        shrimp: "えび",
        crab: "かに",
        peanut: "落花生",
        almond: "アーモンド",
        walnut: "くるみ",
        abalone: "あわび",
        squid: "いか",
        ikura: "いくら",
        orange: "オレンジ",
        cashew: "カシューナッツ",
        kiwi: "キウイフルーツ",
        beef: "牛肉",
        sesame: "ごま",
        salmon: "さけ",
        mackerel: "さば",
        soba: "そば",
        soy: "大豆",
        chicken: "鶏肉",
        banana: "バナナ",
        pork: "豚肉",
        matsutake: "まつたけ",
        peach: "もも",
        yam: "やまいも",
        apple: "りんご",
        gelatin: "ゼラチン"
    };

    const allergyTranslationsJtoE = {
        '卵': 'egg',
        '乳': 'milk',
        '小麦': 'wheat',
        'えび': 'shrimp',
        'かに': 'crab',
        '落花生': 'peanut',
        'アーモンド': 'almond',
        'くるみ': 'walnut',
        'あわび': 'abalone',
        'いか': 'squid',
        'いくら': 'ikura',
        'オレンジ': 'orange',
        'カシューナッツ': 'cashew',
        'キウイフルーツ': 'kiwi',
        '牛肉': 'beef',
        'ごま': 'sesame',
        'さけ': 'salmon',
        'さば': 'mackerel',
        'そば': 'soba',
        '大豆': 'soy',
        '鶏肉': 'chicken',
        'バナナ': 'banana',
        '豚肉': 'pork',
        'まつたけ': 'matsutake',
        'もも': 'peach',
        'やまいも': 'yam',
        'りんご': 'apple',
        'ゼラチン': 'gelatin'
    }

    const menus = {
        drinks: [
            { name: "コーラ", price: 200, image: "images/cola.jpg", allergies: [] },
            { name: "オレンジジュース", price: 250, image: "images/orange_juice.jpg", allergies: ["orange"] },
            { name: "レモンスカッシュ", price: 300, image: "images/lemon_squash.jpg", allergies: [] },
            { name: "アップルジュース", price: 250, image: "images/apple_juice.jpg", allergies: ["apple"] },
            { name: "アイスティー", price: 200, image: "images/iced_tea.jpg", allergies: [] },
            { name: "ミルク", price: 200, image: "images/milk.jpg", allergies: ["milk"] },
            { name: "ウーロン茶", price: 180, image: "images/oolong_tea.jpg", allergies: [] },
            { name: "アイスコーヒー", price: 220, image: "images/iced_coffee.jpg", allergies: ["milk"] }
        ],
        salad_pasta: [
            { name: "シーザーサラダ", price: 600, image: "images/caesar_salad.jpg", allergies: ["egg", "milk"] },
            { name: "グリーンサラダ", price: 550, image: "images/green_salad.jpg", allergies: ["sesame"] },
            { name: "トマトサラダ", price: 580, image: "images/tomato_salad.jpg", allergies: [] },
            { name: "チキンサラダ", price: 650, image: "images/chicken_salad.jpg", allergies: ["chicken"] },
            { name: "ボロネーゼ", price: 800, image: "images/bolo.jpg", allergies: ["wheat", "milk", "beef"] },
            { name: "ペペロンチーノ", price: 750, image: "images/peperon.jpg", allergies: ["wheat"] },
            { name: "カルボナーラ", price: 900, image: "images/carbona.jpg", allergies: ["wheat", "milk", "egg", "pork"] },
            { name: "トマトソースパスタ", price: 800, image: "images/tomato_pasta.jpg", allergies: ["wheat"] }
        ],
        dessert: [
            { name: "チーズケーキ", price: 500, image: "images/cheesecake.jpg", allergies: ["milk", "egg", "wheat"] },
            { name: "ティラミス", price: 550, image: "images/tiramisu.jpg", allergies: ["milk", "egg", "wheat"] },
            { name: "アイスクリーム", price: 300, image: "images/icecream.jpg", allergies: ["milk"] },
            { name: "プリン", price: 400, image: "images/pudding.jpg", allergies: ["milk", "egg"] },
            { name: "シュークリーム", price: 450, image: "images/creampuff.jpg", allergies: ["milk", "egg", "wheat"] }
        ],
        special: [
            { name: "ローストビーフ", price: 1200, image: "images/roast_beef.jpg", allergies: ["beef"] },
            { name: "焼き鳥", price: 700, image: "images/yakitori.jpg", allergies: ["chicken", "wheat"] },
            { name: "エビフライ", price: 850, image: "images/ebi_fry.jpg", allergies: ["shrimp", "wheat", "egg"] },
            { name: "カニクリームコロッケ", price: 900, image: "images/crab_cream_croquette.jpg", allergies: ["crab", "milk", "wheat"] },
            { name: "トンカツ", price: 800, image: "images/tonkatsu.jpg", allergies: ["pork", "wheat", "egg"] }
        ]
    };

    let cart = [];
    let selectedAllergies = []; // 選択されたアレルギーの保持

    function showAllergyScreen() {
        menuScreen.classList.add('hidden');
        allergyScreen.classList.remove('hidden');
    }

    function showMenuScreen() {
        allergyScreen.classList.add('hidden');
        menuScreen.classList.remove('hidden');
    }

    function applyAllergyFilter() {
        // 選択されたアレルギーに基づき、メニューをフィルタリング
        console.log('アレルギー検索が実行されました:', selectedAllergies);

        // フィルタリング後にメニュー画面に戻ります
        showMenuScreen();
        showMenu('salad_pasta'); // ここではデフォルトでサラダ・パスタを表示
    }

    document.querySelectorAll('.allergy-btn').forEach(button => {
        button.addEventListener('click', () => {
            const allergy = allergyTranslationsJtoE[button.getAttribute('data-allergy')];
            if (selectedAllergies.includes(allergy)) {
                selectedAllergies = selectedAllergies.filter(a => a !== allergy);
                button.classList.remove('selected');
            } else {
                selectedAllergies.push(allergy);
                button.classList.add('selected');
            }
        });
    });

    function showMenu(menuType) {
        const menuList = document.getElementById('menuList');
        if (!menuList) {
            console.error("menuList要素が見つかりません。");
            return;
        }

        const selectedMenu = menus[menuType];
        if (!selectedMenu) {
            console.error(`指定されたメニュータイプ "${menuType}" は存在しません。`);
            return;
        }

        // すべてのボタンの選択状態を解除
        document.querySelectorAll('.menu-nav button').forEach(button => {
            button.classList.remove('selected');
        });

        // 現在のメニューボタンを選択状態に設定
        document.getElementById(menuType).classList.add('selected');

        menuList.innerHTML = ''; // 既存のメニューをクリア

        selectedMenu.forEach(item => {
            // アレルギーが選択されている場合、該当アレルギーを含むアイテムは除外
            const isSafe = selectedAllergies.every(allergy => !item.allergies.includes(allergy));

            if (isSafe) {

                const li = document.createElement('li');
                const img = document.createElement('img');
                img.src = item.image;
                img.alt = item.name;

                const infoDiv = document.createElement('div');
                infoDiv.className = "menu-item-info";

                const nameSpan = document.createElement('span');
                nameSpan.textContent = item.name;

                const priceSpan = document.createElement('span');
                priceSpan.textContent = `${item.price}円`;

                infoDiv.appendChild(nameSpan);
                infoDiv.appendChild(document.createElement('br'));
                infoDiv.appendChild(priceSpan);
                li.appendChild(img);
                li.appendChild(infoDiv);

                const allergyIconContainer = document.createElement('div');
                allergyIconContainer.className = "allergy-icons";

                item.allergies.forEach(allergy => {
                    const allergyBtn = document.createElement('button');
                    allergyBtn.className = "allergy-icon-btn";
                    allergyBtn.title = allergyTranslations[allergy];

                    const allergyImg = document.createElement('img');
                    allergyImg.src = `allergies/${allergy}.png`;
                    allergyImg.alt = allergy;

                    allergyBtn.appendChild(allergyImg);
                    allergyBtn.addEventListener('click', (event) => {
                        event.stopPropagation();
                        alert(`${allergyTranslations[allergy]}が含まれています`);
                    });

                    allergyIconContainer.appendChild(allergyBtn);
                });

                li.appendChild(allergyIconContainer);

                li.addEventListener('click', () => {
                    addToCart(item);
                });

                menuList.appendChild(li);
            }
        });
    }

    function addToCart(item) {
        if (cart.length >= 5) {
            alert("一度に注文できるのは5点までです。");
            return;
        }
        cart.push(item);
        updateCart();
    }

    function updateCart() {
        const cartList = document.getElementById('cartList');
        const cartTotal = document.getElementById('cartTotal');
        cartList.innerHTML = '';

        let total = 0;
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            total += item.price;
            li.textContent = `${item.name} - ${item.price}円`;

            // バツ印を追加
            const removeButton = document.createElement('span');
            removeButton.textContent = '×';
            removeButton.className = 'remove-item';
            removeButton.addEventListener('click', (event) => {
                event.stopPropagation(); // イベントの伝播を防止
                removeFromCart(index);
            });

            li.appendChild(removeButton);
            cartList.appendChild(li);
        });

        cartTotal.textContent = `${total}円`;
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCart(); // カートを更新
    }

    function submitOrder() {
        const orderSystem = document.getElementById('order-system');
        const orderConfirmation = document.getElementById('orderConfirmation');

        if (!orderSystem || !orderConfirmation) {
            console.error("注文システムまたは確認要素が見つかりませんでした");
            return;
        }

        if (cart.length === 0) {
            alert("カートが空です");
            return;
        }

        // 注文システムを隠し、確認メッセージを表示する
        orderSystem.classList.add('hidden');
        orderConfirmation.classList.remove('hidden');

        // 確認メッセージの内容を「ご注文ありがとうございました」に変更
        orderConfirmation.textContent = "ご注文ありがとうございました";

        // 2秒後にメニュー画面に戻る
        setTimeout(goBackToMenu, 2000);
    }

    function goBackToMenu() {
        const orderSystem = document.getElementById('order-system');
        const orderConfirmation = document.getElementById('orderConfirmation');

        if (!orderSystem || !orderConfirmation) {
            console.error("注文システムまたは確認要素が見つかりませんでした");
            return;
        }

        // 注文システムを再表示し、確認メッセージを隠す
        orderSystem.classList.remove('hidden');
        orderConfirmation.classList.add('hidden');
        cart = [];
        updateCart(); // カートをクリア
    }

    function showOrderHistory() {
        alert("注文履歴を表示します（デモ機能）");
    }

    function callWaiter() {
        alert("店員を呼びました（デモ機能）");
    }

    function requestBill() {
        alert("会計をリクエストしました（デモ機能）");
    }

    showMenu('salad_pasta'); // 初期表示はサラダ・パスタ

    window.showMenu = showMenu;
    window.submitOrder = submitOrder;
    window.showOrderHistory = showOrderHistory;
    window.callWaiter = callWaiter;
    window.requestBill = requestBill;
    window.showAllergyScreen = showAllergyScreen;
    window.showMenuScreen = showMenuScreen;
    window.applyAllergyFilter = applyAllergyFilter;
});
