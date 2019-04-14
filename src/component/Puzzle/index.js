import React, { Component } from 'react';
import Style from './index.module.sass';
import { defaultImg } from './enum';

const size = { col: 3, row: 3 }

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgList: [],  // 存放切割完未排序的图片
            imgs: [],     // 存放排序完之后的图片 
            imgDiv: '',   // 存放图片布局
            blankItem: {} // 存放空白的位置
        }
    }

    componentDidMount() {
        // var canvas = document.getElementById('imageC');
        var canvas = document.createElement('canvas');
        var img = document.getElementById('img');
        canvas.height = img.clientWidth;
        canvas.width = img.clientHeight;
        var ctx = canvas.getContext('2d');
        let width = 300;
        let height = 300;
        ctx.drawImage(img, 0, 0, width, height);

        //  将图片等分
        for (var x = 0; x < size.col; x++) {
            for (var y = 0; y < size.row; y++) {
                this.cropImage(canvas, (x * width / size.col),
                    (y * height / size.row), width / size.col, height / size.row);
            };
        };
        this.getBackground();
    }

    cropImage = (targetCanvas, x, y, width, height) => {
        var targetctx = targetCanvas.getContext('2d');
        var targetctxImageData = targetctx.getImageData(x, y, width, height);
        var c = document.createElement('canvas');
        var ctx = c.getContext('2d');
        c.width = width;
        c.height = height;
        ctx.rect(0, 0, width, height);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.putImageData(targetctxImageData, 0, 0);

        let imgList = this.state.imgList;
        imgList.push({ src: c.toDataURL('image/jpeg', 0.92) });
        this.setState({ imgList })
    }

    moveImg = (x, y) => {
        const { blankItem } = this.state;
        let _imgs = [];
        let originBlank = blankItem.id;
        this.state.imgs.forEach((img, i) => {
            let _img = {};
            _img.id = img.id;
            _img.originId = img.originId;
            _img.content = img.content;
            _imgs.push(_img);
        });

        console.log(x, y, blankItem)

        if (x === parseInt(blankItem.id / size.col) || y + size.col === blankItem.id || y - size.col === blankItem.id) {
            let clickImg = { id: _imgs[y].id, originId: _imgs[y].originId, content: _imgs[y].content }
            _imgs[originBlank].originId = clickImg.originId;
            _imgs[originBlank].content = clickImg.content;
            _imgs[y].originId = blankItem.originId;
            _imgs[y].content = blankItem.content;
            blankItem.id = _imgs[y].id;
        }

        this.initImg(_imgs);
        this.setState({ blankItem })
    }

    initImg = (_imgs) => {
        let trs = [];
        // let random = [0, 4, 7, 3, 2, 1, 6, 5, 8];
        // _imgs.forEach((img, index) => {
        //     img.randomId = random[index];
        // });
        // function campare(prop) {
        //     return function (a, b) {
        //         var value1 = a[prop];
        //         var value2 = b[prop];
        //         return value1 - value2;
        //     }
        // }
        // _imgs.sort(campare('randomId'));
        for (let i = 0; i < size.row; i++) {
            let tds = [];
            _imgs.forEach((img, index) => {
                // if (index === random[]) {
                if (parseInt(index / size.col) === i) {
                    tds.push(<div className={Style.img} key={index} onClick={this.moveImg.bind(this, i, index)}>
                        <img style={{ width: '66px', height: '66px' }} src={img.content} alt="" />
                    </div>);
                }
            });
            trs.push(<div className={Style.line} key={i}>{tds}</div>);
        }
        let imgDiv = <div className={Style.imgBody}>{trs}</div>;
        this.setState({ imgDiv, imgs: _imgs })
    }

    getBackground = () => {
        const { imgList } = this.state;
        let trs = [];
        let imgs = [];
        for (let i = 0; i < size.col; i++) {
            let tds = [];
            imgList.forEach((img, index) => {
                if (index % size.row === i && index !== imgList.length - 1) {
                    tds.push(
                        <div className={Style.img} key={imgList.length - index} onClick={this.moveImg.bind(this, i, imgs.length)}>
                            <img style={{ width: '66px', height: '66px' }} src={img.src} alt="" />
                        </div>
                    )
                    imgs.push({ originId: imgs.length, id: imgs.length, content: img.src });
                }
            });
            if (i === 2) {
                tds.push(<div className={Style.img} key={imgList.length}></div>)
                imgs.push({ originId: imgs.length, id: imgs.length, content: '' });
            }
            trs.push(<div className={Style.line} key={i}>{tds}</div>);
        }
        let imgDiv = <div className={Style.imgBody}>{trs}</div>;
        this.initImg(imgs);
        this.setState({ blankItem: imgs[imgs.length - 1] })
        // this.setState({ imgDiv, imgs, blankItem: imgs[imgs.length - 1] })
    }

    render() {
        const { imgDiv } = this.state;
        return <div className={Style.root}>
            <div className={Style.defaultImg}><img id="img" alt="" src={defaultImg} /></div>
            {imgDiv}
        </div>
    }
}