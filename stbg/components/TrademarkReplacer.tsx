'use client';

import { useEffect } from 'react';


export default function TrademarkReplacer() {
    useEffect(() => {
        function replaceTrademarks() {
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null
            );
            const textNodesToProcess: Text[] = [];
            let currentNode: Node | null;
            while ((currentNode = walker.nextNode())) {
                const parent = currentNode.parentNode as HTMLElement;
                if (!parent ||
                    parent.tagName === 'SCRIPT' ||
                    parent.tagName === 'STYLE' ||
                    parent.classList?.contains('trademark') ||
                    parent.closest?.('.trademark')) {
                    continue;
                }
                if (
                    currentNode.nodeValue &&
                    /(Procalyx|Swasthera|Swasth)/.test(currentNode.nodeValue)
                ) {
                    const next = currentNode.nextSibling as HTMLElement | null;
                    if (next && next.nodeName === 'SUP' && next.classList?.contains('tm-tag')) {
                        continue;
                    }
                    textNodesToProcess.push(currentNode as Text);
                }

            }
            textNodesToProcess.forEach(textNode => {
                const originalText = textNode.nodeValue || '';
                const regex = /(Procalyx|Swasthera|Swasth)/g;
                const fragment = document.createDocumentFragment();
                let lastIndex = 0;
                let match;
                regex.lastIndex = 0;
                while ((match = regex.exec(originalText)) !== null) {
                    const matchText = match[0];
                    const matchIndex = match.index;
                    if (matchIndex > lastIndex) {
                        fragment.appendChild(
                            document.createTextNode(originalText.slice(lastIndex, matchIndex))
                        );
                    }
                    if (matchText === 'Procalyx') {
                        fragment.appendChild(document.createTextNode('Procalyx'));
                        const sup = document.createElement('sup');
                        sup.className = 'tm-tag';
                        sup.textContent = '™';
                        fragment.appendChild(sup);

                    } else if (matchText === 'Swasthera') {
                        fragment.appendChild(document.createTextNode('Swasthera'));
                        const sup = document.createElement('sup');
                        sup.className = 'tm-tag';
                        sup.textContent = '™';
                        fragment.appendChild(sup);

                    } else if (matchText === 'Swasth') {
                        fragment.appendChild(document.createTextNode('Swasth'));
                        const sup = document.createElement('sup');
                        sup.className = 'tm-tag';
                        sup.textContent = '®';
                        fragment.appendChild(sup);
                    }

                    lastIndex = matchIndex + matchText.length;
                }
                if (lastIndex < originalText.length) {
                    fragment.appendChild(
                        document.createTextNode(originalText.slice(lastIndex))
                    );
                }
                textNode.parentNode?.replaceChild(fragment, textNode);
            });
        }
        const timeoutId = setTimeout(replaceTrademarks, 100);
        let observerTimeoutId: NodeJS.Timeout;
        const observer = new MutationObserver(() => {
            clearTimeout(observerTimeoutId);
            observerTimeoutId = setTimeout(replaceTrademarks, 300);
        });
        const observerStartTimeout = setTimeout(() => {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }, 1000);
        return () => {
            clearTimeout(timeoutId);
            clearTimeout(observerTimeoutId);
            clearTimeout(observerStartTimeout);
            observer.disconnect();
        };
    }, []);


}



// 'use client';

// import { useEffect } from 'react';
// import { usePathname } from 'next/navigation';
// import { useGetAllProductsTrademarkDataQuery } from "@/store/backendSlice/productAPISlice";

// export default function TrademarkReplacer() {
//     const { data: trademarkData, isSuccess } = useGetAllProductsTrademarkDataQuery(undefined);
//     const pathname = usePathname();



//     useEffect(() => {
//         if (!isSuccess || !trademarkData?.data) return;

//         function replaceTrademarks() {
//             const walker = document.createTreeWalker(
//                 document.body,
//                 NodeFilter.SHOW_TEXT,
//                 null
//             );
//             const textNodesToProcess: Text[] = [];
//             let currentNode: Node | null;
//             const trademarkMap = new Map();
//             const currentProduct = trademarkData.data.find((product: any) => {
//                 const productUrl = `/${product.ProductNameURL}`;
//                 return pathname === productUrl || pathname.includes(product.ProductNameURL);
//             });
//             if (currentProduct) {
//                 if ((currentProduct.HasTrademark === 1 || currentProduct.HasTrademark === true) && currentProduct.TrademarkText?.trim()) {
//                     const text = currentProduct.TrademarkText.trim();
//                     trademarkMap.set(text, { type: 'tm', className: 'tm-red' });
//                 }
//                 if ((currentProduct.HasRegistered === 1 || currentProduct.HasRegistered === true) && currentProduct.RegisteredText?.trim()) {
//                     const text = currentProduct.RegisteredText.trim();
//                     trademarkMap.set(text, { type: 'reg', className: 'tm-green' });
//                 }
//             }
//             if (trademarkMap.size === 0) return;
//             const allWords = Array.from(trademarkMap.keys());
//             const escapedWords = allWords.map(word =>
//                 word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
//             );
//             const pattern = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'g');
//             while ((currentNode = walker.nextNode())) {
//                 const parent = currentNode.parentNode as HTMLElement;
//                 if (!parent ||
//                     parent.tagName === 'SCRIPT' ||
//                     parent.tagName === 'STYLE' ||
//                     parent.classList?.contains('trademark') ||
//                     parent.closest?.('.trademark')) {
//                     continue;
//                 }
//                 if (currentNode.nodeValue && pattern.test(currentNode.nodeValue)) {
//                     textNodesToProcess.push(currentNode as Text);
//                 }
//             }
//             textNodesToProcess.forEach(textNode => {
//                 const originalText = textNode.nodeValue || '';
//                 const regex = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'g');
//                 const fragment = document.createDocumentFragment();
//                 let lastIndex = 0;
//                 let match;
//                 regex.lastIndex = 0;
//                 while ((match = regex.exec(originalText)) !== null) {
//                     const matchText = match[0];
//                     const matchIndex = match.index;
//                     if (matchIndex > lastIndex) {
//                         fragment.appendChild(
//                             document.createTextNode(originalText.slice(lastIndex, matchIndex))
//                         );
//                     }
//                     const span = document.createElement('i');
//                     span.className = 'trademark';
//                     const config = trademarkMap.get(matchText);
//                     if (config) {
//                         if (config.type === 'tm') {
//                             span.innerHTML = `${matchText}<sup class="${config.className}">™</sup>`;
//                         } else if (config.type === 'reg') {
//                             span.innerHTML = `${matchText}<sup class="${config.className}">®</sup>`;
//                         }
//                     }
//                     fragment.appendChild(span);
//                     lastIndex = matchIndex + matchText.length;
//                 }
//                 if (lastIndex < originalText.length) {
//                     fragment.appendChild(
//                         document.createTextNode(originalText.slice(lastIndex))
//                     );
//                 }
//                 textNode.parentNode?.replaceChild(fragment, textNode);
//             });
//         }
//         const timeoutId = setTimeout(replaceTrademarks, 100);
//         let observerTimeoutId: NodeJS.Timeout;
//         const observer = new MutationObserver(() => {
//             clearTimeout(observerTimeoutId);
//             observerTimeoutId = setTimeout(replaceTrademarks, 300);
//         });
//         const observerStartTimeout = setTimeout(() => {
//             observer.observe(document.body, {
//                 childList: true,
//                 subtree: true
//             });
//         }, 1000);
//         return () => {
//             clearTimeout(timeoutId);
//             clearTimeout(observerTimeoutId);
//             clearTimeout(observerStartTimeout);
//             observer.disconnect();
//         };
//     }, [isSuccess, trademarkData, pathname]);



//     return (
//         <style jsx global>{`
//             .trademark {
//                 display: inline-block;
//                 font-weight: 500;
//                 font-style: normal;
//             }
//             .tm-red {
//                 background: red;
//                 color: white;
//             }
//             .tm-green {
//                 background: green;
//                 color: white;
//             }
//             .tm-yellow {
//                 background: yellow;
//                 color: black;
//             }
//             .trademark sup {
//                 padding: 2px 4px;
//                 border-radius: 3px;
//                 font-size: 1em;
//                 vertical-align: super;
//                 margin-left: 2px;
//                 font-weight: 600;
//                 line-height: 1;
//             }
//         `}</style>
//     );
// }