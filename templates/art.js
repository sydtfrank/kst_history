/* 本檔案為網頁設計師撰寫,非人請勿修改,以免未來維護困難,如果需修改可請找網頁設計師討論,感謝~ */
$(document).ready(function() {

});


/* 背景色控制 開始 */
$(document).ready(function() {
    init_bg_work();

    if ($(".body_home").length) {
        //首頁
        set_color('#ffafcc', '#fff3c7', '#a2d2ff', '#ffb1a1');
    } else {
        //史前時代
        if ($(".body_epoch_1").length) {
            set_color('#fff3c7', '#efac00', '#abfbff', '#ffcfab');
        }
        //大航海時代
        if ($(".body_epoch_2").length) {
            set_color('#3a9eff', '#a4f4ff', '#beabff', '#f9c2ff');
        }
        //清帝國時代
        if ($(".body_epoch_3").length) {
            set_color('#4e5dff', '#ffeb6f', '#ffcf71', '#ffeed1');
        }
        //日治時代
        if ($(".body_epoch_4").length) {
            set_color('#ffb1a1', '#ffeee5', '#d6fff6', '#ff5a63');
        }
        //中華民國
        if ($(".body_epoch_5").length) {
            set_color('#bae7ff', '#a1ffe2', '#ffd4ea', '#fff332');
        }
    }
});
/* 背景色控制 結束 */


/* 主選單 開始 */
function menu_switch() {
    $(".menu_box").toggleClass("open");
}
/* 主選單 結束 */


/* 時間軸設計 開始 */
function init_timelineRing(arg_data) {
    let currentIndex = 0;
    let total = arg_data.length;
    /* 數值越大，上下項目之間越鬆散 */
    let angleStep = 40;
    let isDragging = false;

    const $ring = $('#timelineRing');
    const $track = $('#star_track');
    const $handle = $('#star_handle');
    $ring.empty();

    arg_data.forEach((item, i) => {
        const nodeBaseAngle = i * angleStep;
        const $node = $(`
                    <div class="timeline-node" data-index="${i}" 
                        style="transform: rotate(${nodeBaseAngle}deg)">
                        <div class="node-dot-container">
                            <div class="node-dot"></div>
                        </div>
                        <div class="node-title"><span>${item.title}</span></div>
                    </div>
                `);

            // --- 新增點擊事件開始 ---
            $node.on('click', function() {
                // 如果點擊的不是當前項，則切換
                if (currentIndex !== i) {
                    currentIndex = i;
                    updateUI(arg_data);
                }
            });
            // --- 新增點擊事件結束 ---

        $ring.append($node);
    });

    // --- 拖拉事件開始 ---

    function handleDrag(pageY) {
        const trackOffset = $track.offset().top;
        const trackHeight = $track.height();
        let relY = (pageY - trackOffset) / trackHeight;

        // 限制在 0.15 ~ 0.85
        let clampedY = Math.max(0.15, Math.min(0.85, relY));
        // 將 0.15~0.85 映射為 0~1
        let indexProgress = (clampedY - 0.15) / (0.85 - 0.15);

        const newIndex = Math.round(indexProgress * (total - 1));

        if (newIndex !== currentIndex) {
            currentIndex = newIndex;
            updateUI(arg_data);
        }
    }

    // 滑鼠按下
    $handle.on('mousedown', function(e) {
        isDragging = true;
        $('body').css('cursor', 'grabbing');
        e.preventDefault();
    });

    // 觸控開始 (手機版)
    $handle.on('touchstart', function(e) {
        isDragging = true;
        e.preventDefault();
    });

    // 全域監聽移動與放開，確保滑鼠離開星星也能繼續拖
    $(window).on('mousemove', function(e) {
        if (!isDragging) return;
        handleDrag(e.pageY);
    }).on('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            $('body').css('cursor', 'default');
        }
    });

    // 觸控移動與結束 (手機版)
    $(window).on('touchmove', function(e) {
        if (!isDragging) return;
        const touch = e.originalEvent.touches[0];
        handleDrag(touch.pageY);
    }).on('touchend', function() {
        isDragging = false;
    });

    // 點擊軌道直接跳轉
    $track.on('click', function(e) {
        if (e.target === $handle[0] || $handle.has(e.target).length > 0) return;
        handleDrag(e.pageY);
    });

    // --- 拖拉事件結束 ---

    updateUI(arg_data);

    $('#prevBtn,#prev_btn').on('click', function(e) {
        e.preventDefault();
        if (currentIndex > 0) {
            currentIndex--;
            updateUI(arg_data);
        }
    });

    $('#nextBtn,#next_btn').on('click', function(e) {
        e.preventDefault();
        if (currentIndex < total - 1) {
            currentIndex++;
            updateUI(arg_data);
        }
    });


    function updateUI(arg_data) {
        const data = arg_data[currentIndex];
        const targetRingRotation = -currentIndex * angleStep;

        // 顯示當前項目筆數
        $('.timeline_box .item_num').text(`${currentIndex + 1} / ${total}`);

        // 旋轉圓環
        $('#timelineRing').css('transform', `rotate(${targetRingRotation}deg)`);

        // 更新星星 handle 的位置 (15% ~ 85%)
        const minRange = 15;
        const maxRange = 85;

        const progress = currentIndex / (total - 1);
        const handlePos = minRange + (progress * (maxRange - minRange));
        $handle.css('top', `${handlePos}%`);

        // 更新節點
        $('.timeline-node').each(function(i) {
            const $node = $(this);
            const $title = $node.find('.node-title');
            const isActive = (i === currentIndex);

            $node.toggleClass('active', isActive);

            // 反向補償旋轉，確保文字水平
            const compensation = -(i * angleStep + targetRingRotation);
            $title.css('transform', `rotate(${compensation}deg)`);

            if (!isActive) {
                const distance = Math.abs(i - currentIndex);
                const blurAmount = Math.min(distance * 0.5, 2);
                const opacityAmount = Math.max(0.3 - (distance * 0.05), 0.1);
                $node.css({ 'filter': `blur(${blurAmount}px)`, 'opacity': opacityAmount });
            } else {
                $node.css({ 'filter': 'none', 'opacity': 1 });
            }
        });

        // --- 切換右側內容區 (Sections) ---
        const $sections = $('.board section');
        $sections.stop().hide().css('opacity', 0);
        const $currentSection = $sections.eq(currentIndex);
        $currentSection.show();
        setTimeout(() => {
            $currentSection.css('opacity', 1);
        }, 10);

        // 按鈕狀態更新
        $('#prevBtn,#prev_btn').prop('disabled', currentIndex === 0);
        $('#nextBtn,#next_btn').prop('disabled', currentIndex === total - 1);

    }

}


/* 時間軸設計 結束 */


/* 首頁-選單 開始 */
$(document).ready(function() {
    let selectedIndex = 0;
    const $items = $('#menuContainer .menu_item');
    const totalItems = $items.length;
    const $container = $('#menuContainer');
    const $star = $('#starHandle');
    const $track = $('#starTrack');

    // --- 新增：設定星星的移動範圍 (百分比) ---
    const minRange = 15; // 距離頂端 15%
    const maxRange = 85; // 距離底端 15% (即 85% 處)
    const activeRange = maxRange - minRange; // 實際可變動範圍 70%

    let isDragging = false;

    function updateUI(smoothStar = true) {
        // 1. 更新項目狀態與層級
        $items.each(function(index) {
            const $item = $(this);
            const distance = Math.abs(index - selectedIndex);
            $item.removeClass('active far');

            if (index === selectedIndex) {
                $item.addClass('active');
            } else if (distance > 1) {
                $item.addClass('far');
            }
            $item.css('z-index', 10 - distance);
        });

        // 2. 移動容器
        /*
        const translateY = (1.5 - selectedIndex) * 50;
        $container.css('transform', `translateY(${translateY}px)`);
        */

        // 3. 移動星星 (套用範圍限制)
        if (smoothStar) {
            $star.css('transition', 'top 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)');
            // 將 index 比例映射到 minRange ~ maxRange
            const starPercent = minRange + (selectedIndex / (totalItems - 1)) * activeRange;
            $star.css('top', `${starPercent}%`);
        }
    }

    function handleTrackInteraction(e) {
        const rect = $track[0].getBoundingClientRect();
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        let offsetY = clientY - rect.top;

        offsetY = Math.max(0, Math.min(offsetY, rect.height));
        const percent = offsetY / rect.height; // 這是滑鼠在軌道上的真實比例 (0~1)

        // 計算對應的 Index
        const newIndex = Math.round(percent * (totalItems - 1));

        if (newIndex !== selectedIndex) {
            selectedIndex = newIndex;
            updateUI(false);
        }

        // 移動星星 (拖動時的即時視覺反饋，也要套用範圍限制)
        $star.css('transition', 'none');
        const visualPercent = minRange + (percent * activeRange);
        $star.css('top', `${visualPercent}%`);
    }

    // ... 以下事件監聽 (mousedown, mousemove, click 等) 保持不變 ...
    $track.on('mousedown touchstart', function(e) {
        isDragging = true;
        handleTrackInteraction(e);
        e.preventDefault();
    });

    $(document).on('mousemove touchmove', function(e) {
        if (isDragging) {
            handleTrackInteraction(e);
        }
    });

    $(document).on('mouseup touchend', function() {
        if (isDragging) {
            isDragging = false;
            updateUI(true);
        }
    });

    $items.on('click', function() {
        const index = parseInt($(this).data('index'));
        const link = $(this).data('link');

        if (index === selectedIndex) {
            window.location.href = link;
        } else {
            selectedIndex = index;
            updateUI(true);
        }
    });

    updateUI(true);
});
/* 首頁-選單 結束 */


/* 頁尾高度 開始 */
function updateBoardHeight() {
    const footer = document.querySelector('.footer_box');
    const boardSection = document.querySelector('.board section');

    if (footer && boardSection) {
        const footerHeight = footer.offsetHeight;
        document.documentElement.style.setProperty('--footer-height', footerHeight + 'px');
    }
}

window.addEventListener('load', updateBoardHeight);
window.addEventListener('resize', updateBoardHeight);
/* 頁尾高度 結束 */


/* 多張圖片預載 開始 */
const preloadImages = (urls) => {
    urls.forEach((url) => {
        const img = new Image();
        img.src = url;
    });
};
preloadImages([
    'templates/images/tab_bg_01_active.svg',
    'templates/images/tab_bg_02_active.svg',
    'templates/images/tab_bg_03_active.svg',
    'templates/images/tab_bg_04_active.svg',
    'templates/images/tab_bg_05_active.svg'
]);
/* 多張圖片預載 結束 */