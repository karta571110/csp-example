import { DOCUMENT, ɵgetDOM as getDOM } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ɵSharedStylesHost } from '@angular/platform-browser';

/** 自訂樣式設置器 */
@Injectable()
export class CustomDomSharedStylesHost
  extends ɵSharedStylesHost
  implements OnDestroy
{
  // Maps all registered host nodes to a list of style nodes that have been added to the host node.
  private _hostNodes = new Map<Node, Node[]>();

  /** 亂數值 */
  private _nonce: string | null | undefined = null;

  constructor(
    /** Angular 虛擬DOM */
    @Inject(DOCUMENT) private _doc: Document,
    /** Meta 標籤選擇器字串 */
    @Inject('cspMetaSelector') private _metaCspTag: string
  ) {
    super(_doc, _metaCspTag);
    this._hostNodes.set(_doc.head, []);
    this._setCspNonce();
  }

  /**
   * 增加host節點設定
   *
   * @param hostNode - 當前節點
   */
  override addHost(hostNode: Node): void {
    const styleNodes: Node[] = [];

    this._hostNodes.set(hostNode, styleNodes);
  }

  /**
   * 移除host節點設定
   *
   * @param hostNode - 當前節點
   */
  override removeHost(hostNode: Node): void {
    const styleNodes = this._hostNodes.get(hostNode);

    if (styleNodes) {
      styleNodes.forEach(removeStyle);
    }
    this._hostNodes.delete(hostNode);
  }

  /**
   * 樣式增加觸發
   *
   * @param additions - 額外樣式
   */
  override onStyleAdded(additions: Set<string>): void {
    this._hostNodes.forEach((styleNodes, hostNode) => {
      this.addStyleToHost(additions, hostNode, styleNodes);
    });
  }

  /**
   * Angular生命週期
   * 元件銷毀時觸發
   */
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._hostNodes.forEach((styleNodes) => styleNodes.forEach(removeStyle));
  }

  /**
   * 增加樣式到主體
   *
   * @param styles - 樣式
   * @param host - 主體
   * @param styleNodes - 樣式節點
   */
  override addStyleToHost(
    styles: Set<string>,
    host: Node,
    styleNodes: Node[]
  ): void {
    styles.forEach((style: string) => {
      const styleEl = this._doc.createElement('style');

      styleEl.textContent = style;

      if (!style.includes('without-nonce') && this._nonce) {
        styleEl.setAttribute('nonce', this._nonce);
      }

      styleNodes.push(host.appendChild(styleEl));
    });

    if (this._nonce) {
      this._removeCspNonceHeader();
    }
  }

  /** 設置亂數 */
  private _setCspNonce(): void {
    this._nonce = document
      .querySelector(this._metaCspTag)
      ?.getAttribute('content');
  }

  /** 移除Csp標頭 */
  private _removeCspNonceHeader(): void {
    document.querySelector(this._metaCspTag)?.remove();
  }
}

/**
 * 移除樣式節點
 *
 * @param styleNode - 樣式節點
 */
function removeStyle(styleNode: Node): void {
  getDOM().remove(styleNode);
}
