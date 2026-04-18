import { BaseOperation } from "@/base_classes/base_operation";
import { FetchLessonsApiOperation } from "@/operations/fetch_lessons_api_operation";
import { JsonUploadOperation } from "@/operations/json_upload_operation";

export class UpdateLessonsOperation extends BaseOperation {
  _operation() {
    // 1. APIからデータを取得する
    const fetchOperation = new FetchLessonsApiOperation();
    const dataResponse = fetchOperation._operation();
    
    // 2. 受け取ったオブジェクトを文字列化してスプレッドシート適用処理へ渡す
    const jsonString = JSON.stringify(dataResponse);
    const uploadOperation = new JsonUploadOperation(jsonString);
    const uploadResult = uploadOperation._operation();

    if (uploadResult.status === "success") {
      return {
        status: "success",
        message: `${uploadResult.count}件のレッスンデータをAPIから取得し、反映しました。`
      };
    } else {
      throw new Error(uploadResult.message || "スプレッドシートへの適用に失敗しました。");
    }
  }
}
