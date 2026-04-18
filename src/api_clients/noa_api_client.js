import { BaseApiClient, METHODS } from '@/base_classes/base_api_client';

/**
 * NOA Dance API クライアント
 */
export class NoaApiClient extends BaseApiClient {
  /**
   * NOA Dance API のベースURL
   * @returns {string}
   */
  get _BASE_URL() {
    return 'https://r8t00r3qx7.execute-api.ap-northeast-1.amazonaws.com';
  }

  /**
   * NOA Dance API のベースヘッダー
   * @returns {Object}
   */
  get _BASE_HEADERS() {
    return {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'en-GB,en;q=0.9,ja-JP;q=0.8,ja;q=0.7,en-US;q=0.6',
      'content-type': 'application/json',
      'origin': 'https://www.noadance.com',
      'priority': 'u=1, i',
      'referer': 'https://www.noadance.com/',
      'sec-ch-ua': '"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36'
    };
  }
}

/**
 * NOA Dance API エンドポイント定義
 */
export const NOA_API = {
  lessons: {
    /**
     * レッスン一覧を取得する
     * @param {Object} params
     * @param {Array<string>} params.location - ロケーション一覧
     * @param {Array<string>} params.genre - ジャンル一覧
     * @param {string} params.brand - ブランドID
     * @param {boolean} params.is_month - 月判定フラグ
     * @returns {Object} エンドポイント定義
     */
    fetch: ({ location, genre, brand, is_month }) => ({
      method: METHODS.POST,
      path: '/PRD',
      payload: { location, genre, brand, is_month },
    }),
  },
};

