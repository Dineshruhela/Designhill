//i am using this to access pseudoStyle of an element;
(function () {
    a = {
        _b: 0,
        c: function () {
            this._b++;
            return this.b;
        }
    };
    HTMLElement.prototype.pseudoStyle = function (d, e, f) {
        var g = "pseudoStyles";
        var h = document.head || document.getElementsByTagName('head')[0];
        var i = document.getElementById(g) || document.createElement('style');
        i.id = g;
        var j = "pseudoStyle" + a.c();
        this.className += " " + j;
        i.innerHTML += " ." + j + ":" + d + "{" + e + ":" + f + "}";
        h.appendChild(i);
        return this;
    };
})();
$(function () {
    var data;
    let page = 0;
    let tl = 0;
    let counter = 0;
    let currentDate;
    let dt = new Date();

    function getToday() {
        var dd = dt.getDate();
        var mm = dt.getMonth() + 1;
        var yyyy = dt.getFullYear();
        return dd + "/" + (mm < 10 ? '0' + mm : mm) + "/" + yyyy;
    };
    $.ajax({
        url: "data/data.json",
        success: function (result) {
            data = result;
            currentDate = "Today";

            tl = (data.length);
            addPage(++page);
        }
    });

    function getPageId(n) {
        return 'msg-page-' + n;
    }

    function getDocumentHeight() {
        const body = document.body;
        const html = document.documentElement;
        return Math.max(
            body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight
        );
    };

    function getScrollTop() {
        return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    }


    function getmsg(data1) {
        const msg = document.createElement('div');
        msg.classList += "msg-list__item";
        const item = document.createElement('li');
        const span = document.createElement('span');
        var lableDate = document.createElement('span');
        lableDate.className = "lableDate";
        span.className = "dateformat";
        if (data1) {
            if (currentDate !== data1.date && data1.date != undefined) {

                msg.setAttribute('data-currentDate', currentDate);
                msg.appendChild(lableDate);
            } else {
                if (data1.date == getToday() || data1.date == undefined && currentDate != 'Today') {
                    currentDate = 'Today';
                }
                msg.pseudoStyle("before", "display", "none");

            }
            if (data1.date != undefined) {
                var todayString = data1.date === getToday();
                lableDate.innerHTML = todayString ? 'Today' : data1.date;
                item.innerHTML = data1.messageContent;
                currentDate = data1.date;
                span.innerText = data1.date;

            }
            item.appendChild(span);
            msg.prepend(item);
            return msg;
        }
        return;
    }

    function getmsgPage(page, msgsPerPage = 25) {
        const pageElement = document.createElement('div');
        pageElement.id = getPageId(page);
        pageElement.className = 'msg-list__page';
        console.log(counter, (page * msgsPerPage), tl);
        while (counter <= (page * msgsPerPage) && tl > counter) {

            pageElement.appendChild(getmsg(data[counter]));
            pageElement.setAttribute('data-currentDate', currentDate)
            counter++;
            console.log(counter);
        }
        return pageElement;
    }



    function fetchPage(page) {
        msgList.appendChild(getmsgPage(page));
    }

    function addPage(page) {
        fetchPage(page);

    }




    window.onscroll = function () {
        if (getScrollTop() < getDocumentHeight() - window.innerHeight) return;
        if (tl > counter) {
            addPage(++page);
        }

    };
    const msgList = document.getElementById('msg-list');



});