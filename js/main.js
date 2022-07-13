if (document.readyState === 'complete' || document.readyState !== 'loading' && !document.documentElement.doScroll) {
 callback();
} else {
    document.addEventListener('DOMContentLoaded', async() => {
        console.log('DOMContentLoaded');

        function selectCopyText(node) {
            let isVal=true;
            node = document.getElementById(node);
            try {
                node.select();
                try {
                    node.setSelectionRange(0, 99999); /* For mobile devices */
                } catch(err0) {}
            } catch(err) {
                isVal=false;
                console.log(err.message);
                if (document.body.createTextRange) {
                    const range = document.body.createTextRange();
                    range.moveToElementText(node);
                    range.select();
                } else if (window.getSelection) {
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(node);
                    selection.removeAllRanges();
                    selection.addRange(range);
                } else {
                    console.warn('Could not select text in node: Unsupported browser.');
                }
            } finally {
                navigator.clipboard.writeText(isVal ? node.value : node.innerText);
            }
        }

        let copyTextIcon=document.getElementById('copyTextIcon');
        copyTextIcon.addEventListener('click', (evt)=> {
            selectCopyText(evt.target.value);
        }, false);

        let faviconSize=96;

        let resizedIconW=document.getElementById('resizedIconW');
        let resizedIconH=document.getElementById('resizedIconH');
        resizedIconW.value=faviconSize;
        resizedIconH.value=faviconSize;

        const hourIcon=['','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚','🕛'];
        const halfHourIcon=['','🕜','🕝','🕞','🕟','🕠','🕡','🕢','🕣','🕤','🕥','🕦','🕧'];

        const currentDatetime=(new Date());
        let currentHour=currentDatetime.getHours();
        currentHour=(currentHour>12) ? (currentHour-12) : currentHour;
        let faviconIcon=hourIcon[currentHour];
        let currentMin=currentDatetime.getMinutes();
        faviconIcon=(currentMin>30) ? (halfHourIcon[currentHour]) : faviconIcon; 

        let canvasDisplay=document.getElementById('canvasDisplay');
        let textIcon=document.getElementById('textIcon');
        textIcon.innerText=faviconIcon;
       
        let _scale=window.devicePixelRatio*2;
        let w,h,fontSize,canvas,ctx,_x,_y,faviconTag;

        let canvasDisplayCell=document.getElementById('canvasDisplayCell');
        canvasDisplayCell['style']['width']=`${canvasDisplayCell.clientWidth}px`;
        canvasDisplayCell['style']['height']=`${canvasDisplayCell.clientHeight}px`;

        canvasDisplay['style']['max-width']=`${canvasDisplayCell.clientWidth}px`;
        canvasDisplay['style']['max-height']=`calc( ${canvasDisplayCell.clientHeight}px - 1.875rem - 4px )`;

        let equalAspectRatio=document.getElementById('equalAspectRatio');

        const removeAllChildNodes = ((parentEle) => parentEle.children.length > 0  ? parentEle.removeChild(parentEle.children[0]) : null);

        async function generateFavicon(sizeW,sizeH,icon) {
            textIcon.innerText=icon;

            w=sizeW;
            h=sizeH;
            fontSize=sizeH/_scale;

            canvas=document.createElement('canvas');
            canvas.width=w;
            canvas.height=h;

            canvas['style']['margin']='1px auto';
            canvas['style']['width']=`${w/_scale}px`;
            canvas['style']['height']=`${h/_scale}px`;
            canvas['style']['border']='1px dotted #6c757d';
            canvas['style']['background']='transparent';

            ctx=canvas.getContext('2d');
            ctx.scale(_scale,_scale);

            ctx.font = `${fontSize}px Segoe Ui Emoji`;
            ctx.textAlign = 'center';
            ctx.textBaseline='middle';
            ctx.direction='ltr';
            ctx.globalAlpha=1.0;
            ctx.fontVariantCaps='unicase';
            ctx.fontKerning='auto';
            ctx.fontStretch='normal';
            ctx.filter='none';
            ctx.globalCompositeOperation='source-over';
            ctx.imageSmoothingEnabled=true;
            ctx.imageSmoothingQuality='high';
            ctx.letterSpacing='0px';
            ctx.lineCap='butt';
            ctx.lineDashOffset=0;
            ctx.lineJoin='miter';
            ctx.lineWidth=0;
            ctx.miterLimit=10;
            ctx.shadowBlur=0;
            ctx.shadowColor='rgba(0, 0, 0, 0)';
            ctx.shadowOffsetX=0;
            ctx.shadowOffsetY=0;
            ctx.strokeStyle='#000000';
            ctx.textRendering='auto';
            ctx.wordSpacing=0;
            ctx.fillStyle='#ffffff';
            
            _x=((canvas.width/_scale)/2);
            _y=((canvas.height/_scale)/2);

            ctx.fillText(icon, _x, _y);
            
            removeAllChildNodes(canvasDisplay);
            canvasDisplay.appendChild(canvas);
            document.getElementById('faviconDimensionsDisplay').innerText=`${canvas.width}px × ${canvas.height}px`;

            return new Promise(resolve => resolve(canvas.toDataURL()));
        }
        let iconData = await generateFavicon(faviconSize,faviconSize,faviconIcon);

        const ddlMapper = {
            'smileys_n_ppl':smileys_n_ppl,
            'animals_n_nature':animals_n_nature,
            'fnb':fnb,
            'activity':activity,
            'commute_n_places': commute_n_places,
            'objects':objects,
            'symbols':symbols,
        };

        function populatedDDL(ddlId) {
            let selectIconDDL=document.getElementById(ddlId);
            let i=0;
            let icons=ddlMapper[ddlId];
            for(let icon in icons) {
                let iconOption=document.createElement('option');
                iconOption.value=icon;
                iconOption.text=`${icons[icon]} ${icon}`;
                if(i==0) {
                    iconOption.setAttribute('selected',true);
                }
                selectIconDDL.add(iconOption, i[i++]);
            }
            selectIconDDL.addEventListener('change', async(evt)=>{
                categorySelection.forEach(async(node) => {
                    if(node.value==selectIconDDL.id && node.checked) {
                        faviconIcon=selectIconDDL.value;
                        canvas.getContext('2d').clearRect(0, 0,w,h);

                        iconData = await generateFavicon(resizedIconW.value,resizedIconH.value,faviconIcon);
                        saveImageBtn.value=iconData;
                        faviconTag.href=iconData;

                        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
                    }
                });
            },false);
        }
        
        populatedDDL('smileys_n_ppl');
        populatedDDL('animals_n_nature');
        populatedDDL('fnb');
        populatedDDL('activity');
        populatedDDL('commute_n_places');
        populatedDDL('objects');
        populatedDDL('symbols');

        async function renderIcon() {
            canvas.getContext('2d').clearRect(0, 0,w,h);

            iconData = await generateFavicon(resizedIconW.value,resizedIconH.value,faviconIcon);
            saveImageBtn.value=iconData;
            faviconTag.href=iconData;

            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        }
        resizedIconW.addEventListener('change', async(evt)=>{
            if(equalAspectRatio.checked) {
                resizedIconH.value=evt.target.value;
            }
            renderIcon();
        },false);

        resizedIconH.addEventListener('change', async(evt)=>{
            if(equalAspectRatio.checked) {
                resizedIconW.value=evt.target.value;
            }
            renderIcon();
        },false);

        let categorySelection=document.querySelectorAll('input[name="category"]');
        categorySelection.forEach((node) => {
            node.addEventListener('click', async(evt)=> {
                faviconIcon=document.getElementById(evt.target.value).value;
                renderIcon();
            }, false);
        });

        equalAspectRatio.addEventListener('click', async(evt)=> {
            if(equalAspectRatio.checked) {
                faviconSize=Math.min(resizedIconW.value,resizedIconH.value);
                resizedIconW.value=faviconSize;
                resizedIconH.value=faviconSize;
            }
            renderIcon();
        }, false);

        let saveImageBtn=document.getElementById('saveImageBtn');
        saveImageBtn.value=iconData;
        saveImageBtn.addEventListener('click', (evt)=> {
            let downloadLink=document.createElement('a');
            downloadLink.href=saveImageBtn.value;

            downloadLink.download=`${resizedIconW.value}w_${resizedIconH.value}h.png`;
            downloadLink.click();
        }, false);

        let linkTags=document.getElementsByTagName('link');
        let faviconIsMissing=true;
        for(let linkTag of linkTags) {
            if( linkTag.hasAttribute('rel') && (linkTag.rel.includes('icon')) ) {
                faviconIsMissing=false;
                faviconTag=linkTag;
                console.log('favicon tag exists');
                linkTag.type='image/x-icon';
                console.log('Generate favicon here.');
                linkTag.href=iconData;
                break;
            }
        }
        if(faviconIsMissing) {
            console.log('favicon tag is missing');
            console.log('[Tag missing] Generate favicon here');
            faviconTag=document.createElement('link');
            faviconTag.rel='icon';
            faviconTag.type='image/x-icon';
            faviconTag.href=iconData;
            document.head.appendChild(faviconTag);
        }
    });
}