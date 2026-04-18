import { BaseOperation } from "@/base_classes/base_operation";
import { NoaApiClient, NOA_API } from "@/api_clients/noa_api_client";

export class FetchLessonsApiOperation extends BaseOperation {
  _operation() {
    const apiClient = new NoaApiClient();
    const payloadParams = {
      location: ["8", "4", "14", "15", "10", "13", "1", "7", "5", "3", "2", "6", "11", "12"],
      genre: ["01", "18", "09", "03", "15", "10", "02", "08", "07", "06", "04", "05"],
      brand: "1",
      is_month: true
    };

    const response = apiClient.request(NOA_API.lessons.fetch(payloadParams));

    if (response && response.status === 200 && response.data) {
      return response.data;
    } else {
      throw new Error(`APIリクエストに失敗しました。ステータス: ${(response && response.status) ? response.status : 'Unknown'}`);
    }
  }
}
