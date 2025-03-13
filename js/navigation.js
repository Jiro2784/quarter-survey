/**
 * QUARTERアンケート - ナビゲーション機能
 */

// 即時実行で初期化（最も確実な方法）
(function() {
  // ページ読み込み完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    // すでに読み込み完了している場合は直接実行
    initNavigation();
  }
  
  /**
   * ナビゲーション機能の初期化
   */
  function initNavigation() {
    console.log('【ナビゲーション】初期化開始');
    
    // ナビゲーションアイテムを取得
    const navItems = document.querySelectorAll('.nav-item');
    console.log('【ナビゲーション】アイテム数:', navItems.length);
    
    // クリックイベントを設定（シンプルに保つ）
    navItems.forEach(item => {
      item.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const section = this.getAttribute('data-section');
        console.log('【ナビゲーション】クリック:', section);
        
        // 該当セクションの要素を探す（複数ある場合は最初の要素）
        const targetElement = document.querySelector('.question[data-section="' + section + '"]');
        
        if (targetElement) {
          console.log('【ナビゲーション】要素発見:', targetElement);
          
          // スクロール処理（複数の方法を試す）
          try {
            // 1. scrollIntoView - シンプルな方法
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
            
            // 2. 代替方法 - 位置を計算して手動スクロール
            setTimeout(function() {
              const rect = targetElement.getBoundingClientRect();
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              const targetTop = rect.top + scrollTop - 80; // ヘッダー分の調整
              
              window.scrollTo({
                top: targetTop,
                behavior: 'smooth'
              });
            }, 10);
            
            // アクティブ状態の更新
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
          } catch (error) {
            console.error('【ナビゲーション】スクロールエラー:', error);
          }
        } else {
          console.error('【ナビゲーション】対象要素が見つかりません:', section);
          console.log('利用可能なセクション:', 
            Array.from(document.querySelectorAll('.question[data-section]'))
              .map(el => el.getAttribute('data-section'))
          );
        }
        
        return false; // イベントキャンセル
      };
    });
    
    console.log('【ナビゲーション】初期化完了');
  }
  
  // グローバルに公開
  window.initNavigation = initNavigation;
})();
