/* 本檔案為網頁設計師撰寫,非人請勿修改,以免未來維護困難,如果需修改可請找網頁設計師討論,感謝~ */
$(document).ready(function () {

});


/* 背景色控制 開始 */
$(document).ready(function () {
    init_bg_work();
    if ($("body.page_home").length) {
        //首頁
        set_color('#ffafcc', '#ffc8dd', '#a2d2ff', '#bde0fe');
    } else {
        //史前時代
        if ($("body.epoch_1").length) {
            set_color('#fff3c7', '#efac00', '#abfbff', '#ffcfab');
        }
        //大航海時代
        if ($("body.epoch_2").length) {
            set_color('#3a9eff', '#a4f4ff', '#beabff', '#f9c2ff');
        }
        //清帝國時代
        if ($("body.epoch_3").length) {
            set_color('#4e5dff', '#ffeb6f', '#ffcf71', '#ffeed1');
        }

        //日治時代
        if ($("body.epoch_4").length) {
            set_color('#ffb1a1', '#ffeee5', '#d6fff6', '#ff5a63');
        }

        //中華民國
        if ($("body.epoch_5").length) {
            set_color('#bae7ff', '#a1ffe2', '#ffd4ea', '#fff332');
        }

    }
});
/* 背景色控制 結束 */


/* 主選單 開始 */
function menu_switch() {
	$(".menu_box").toggleClass("close");
}
/* 主選單 結束 */


/* 時間軸設計 開始 */
let currentIndex = null;
let total = null;
let angleStep = null;

function init_timelineRing(arg_data) {
	currentIndex = 0;
	total = arg_data.length;
	/* 數值越大，上下項目之間越鬆散 */
	angleStep = 40;

	const $ring = $('#timelineRing');
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

		/*
		$node.on('click', () => {
			currentIndex = i;
			updateUI(arg_data);
		});
		*/

		$ring.append($node);
	});

	updateUI(arg_data);

	$('.timeline_box #prevBtn').on('click', function (e) {
		e.preventDefault();
		if (currentIndex > 0) {
			currentIndex--;
			updateUI(arg_data);
		}
	});

	$('.timeline_box #nextBtn').on('click', function (e) {
		e.preventDefault();
		if (currentIndex < total - 1) {
			currentIndex++;
			updateUI(arg_data);
		}
	});


}

function updateUI(arg_data) {
	const data = arg_data[currentIndex];
	const targetRingRotation = -currentIndex * angleStep;

	// 顯示當前項目筆數
	$('.timeline_box .item_num').text(`${currentIndex + 1} / ${total}`);

	// 旋轉圓環
	$('#timelineRing').css('transform', `rotate(${targetRingRotation}deg)`);

	// 更新節點
	$('.timeline-node').each(function (i) {
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

	// 按鈕狀態更新
	$('.timeline_box #prevBtn').prop('disabled', currentIndex === 0);
	$('.timeline_box #nextBtn').prop('disabled', currentIndex === total - 1);

}


/* 時間軸設計 結束 */