import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { RefreshCw, X, Clock, MapPin, User, ChevronRight, Activity, Calendar, Filter, Check, ChevronDown, ChevronUp } from 'lucide-react';

// ==========================================
// ダミーデータ定義（約20件）
// ==========================================
const dummyApiResponse = {
  statusCode: 200,
  body: {
    Items: [
      {
        YOUBI: "MON",
        time_list: [
          {
            record: [
              { SEQ: 1, Y_TIME_START: "12:00", Y_TIME_END: "13:25", TENPO_NAME: "御茶ノ水", STUDIO_NAME: "4st", GENRE_SUB_NAME: "GIRL'S HIPHOP", LEVEL_NAME: "超入門", INSTRUCTOR_NAME: "平野 麻衣", NICKNAME: "mai", HIDUKE: "20260420", URL: "https://example.com/1", INSTRUCTOR_IMG: "" },
              { SEQ: 2, Y_TIME_START: "14:00", Y_TIME_END: "15:25", TENPO_NAME: "新宿", STUDIO_NAME: "2st", GENRE_SUB_NAME: "JAZZ", LEVEL_NAME: "初級", INSTRUCTOR_NAME: "鈴木 花子", NICKNAME: "hanako", HIDUKE: "20260420", URL: "https://example.com/2", INSTRUCTOR_IMG: "" },
              { SEQ: 3, Y_TIME_START: "18:00", Y_TIME_END: "19:25", TENPO_NAME: "渋谷", STUDIO_NAME: "Ast", GENRE_SUB_NAME: "HIPHOP", LEVEL_NAME: "入門", INSTRUCTOR_NAME: "佐藤 健太", NICKNAME: "KEN", HIDUKE: "20260420", URL: "https://example.com/3", INSTRUCTOR_IMG: "" },
              { SEQ: 4, Y_TIME_START: "19:30", Y_TIME_END: "20:55", TENPO_NAME: "池袋", STUDIO_NAME: "Bst", GENRE_SUB_NAME: "HOUSE", LEVEL_NAME: "中級", INSTRUCTOR_NAME: "高橋 誠", NICKNAME: "MAKOTO", HIDUKE: "20260420", URL: "https://example.com/4", INSTRUCTOR_IMG: "" }
            ]
          }
        ]
      },
      {
        YOUBI: "TUE",
        time_list: [
          {
            record: [
              { SEQ: 5, Y_TIME_START: "11:00", Y_TIME_END: "12:25", TENPO_NAME: "恵比寿", STUDIO_NAME: "1st", GENRE_SUB_NAME: "BALLET", LEVEL_NAME: "入門", INSTRUCTOR_NAME: "伊藤 美咲", NICKNAME: "misaki", HIDUKE: "20260421", URL: "https://example.com/5", INSTRUCTOR_IMG: "" },
              { SEQ: 6, Y_TIME_START: "13:00", Y_TIME_END: "14:25", TENPO_NAME: "秋葉原", STUDIO_NAME: "3st", GENRE_SUB_NAME: "POP", LEVEL_NAME: "初級", INSTRUCTOR_NAME: "渡辺 剛", NICKNAME: "GO", HIDUKE: "20260421", URL: "https://example.com/6", INSTRUCTOR_IMG: "" },
              { SEQ: 7, Y_TIME_START: "15:30", Y_TIME_END: "16:55", TENPO_NAME: "新宿", STUDIO_NAME: "4st", GENRE_SUB_NAME: "LOCK", LEVEL_NAME: "超入門", INSTRUCTOR_NAME: "中村 俊", NICKNAME: "shun", HIDUKE: "20260421", URL: "https://example.com/7", INSTRUCTOR_IMG: "" },
              { SEQ: 8, Y_TIME_START: "20:00", Y_TIME_END: "21:25", TENPO_NAME: "渋谷", STUDIO_NAME: "Cst", GENRE_SUB_NAME: "R&B", LEVEL_NAME: "中級", INSTRUCTOR_NAME: "小林 翔", NICKNAME: "SHO", HIDUKE: "20260421", URL: "https://example.com/8", INSTRUCTOR_IMG: "" }
            ]
          }
        ]
      },
      {
        YOUBI: "WED",
        time_list: [
          {
            record: [
              { SEQ: 9, Y_TIME_START: "10:30", Y_TIME_END: "11:55", TENPO_NAME: "池袋", STUDIO_NAME: "Ast", GENRE_SUB_NAME: "HIPHOP", LEVEL_NAME: "入門", INSTRUCTOR_NAME: "加藤 結衣", NICKNAME: "YUI", HIDUKE: "20260422", URL: "https://example.com/9", INSTRUCTOR_IMG: "" },
              { SEQ: 10, Y_TIME_START: "17:00", Y_TIME_END: "18:25", TENPO_NAME: "御茶ノ水", STUDIO_NAME: "2st", GENRE_SUB_NAME: "JAZZ FUNK", LEVEL_NAME: "初級", INSTRUCTOR_NAME: "吉田 遥", NICKNAME: "haruka", HIDUKE: "20260422", URL: "https://example.com/10", INSTRUCTOR_IMG: "" },
              { SEQ: 11, Y_TIME_START: "18:30", Y_TIME_END: "19:55", TENPO_NAME: "恵比寿", STUDIO_NAME: "3st", GENRE_SUB_NAME: "WAACK", LEVEL_NAME: "入門", INSTRUCTOR_NAME: "山田 凛", NICKNAME: "RIN", HIDUKE: "20260422", URL: "https://example.com/11", INSTRUCTOR_IMG: "" },
              { SEQ: 12, Y_TIME_START: "21:00", Y_TIME_END: "22:25", TENPO_NAME: "新宿", STUDIO_NAME: "1st", GENRE_SUB_NAME: "HIPHOP", LEVEL_NAME: "オープン", INSTRUCTOR_NAME: "佐々木 翼", NICKNAME: "TSUBASA", HIDUKE: "20260422", URL: "https://example.com/12", INSTRUCTOR_IMG: "" }
            ]
          }
        ]
      },
      {
        YOUBI: "THU",
        time_list: [
          {
            record: [
              { SEQ: 13, Y_TIME_START: "12:00", Y_TIME_END: "13:25", TENPO_NAME: "渋谷", STUDIO_NAME: "Bst", GENRE_SUB_NAME: "CONTEMPORARY", LEVEL_NAME: "初級", INSTRUCTOR_NAME: "山口 玲奈", NICKNAME: "reina", HIDUKE: "20260423", URL: "https://example.com/13", INSTRUCTOR_IMG: "" },
              { SEQ: 14, Y_TIME_START: "14:30", Y_TIME_END: "15:55", TENPO_NAME: "秋葉原", STUDIO_NAME: "1st", GENRE_SUB_NAME: "BREAK", LEVEL_NAME: "入門", INSTRUCTOR_NAME: "松本 龍", NICKNAME: "RYU", HIDUKE: "20260423", URL: "https://example.com/14", INSTRUCTOR_IMG: "" },
              { SEQ: 15, Y_TIME_START: "19:00", Y_TIME_END: "20:25", TENPO_NAME: "池袋", STUDIO_NAME: "Cst", GENRE_SUB_NAME: "GIRL'S HIPHOP", LEVEL_NAME: "中級", INSTRUCTOR_NAME: "井上 さくら", NICKNAME: "sakura", HIDUKE: "20260423", URL: "https://example.com/15", INSTRUCTOR_IMG: "" },
              { SEQ: 16, Y_TIME_START: "20:30", Y_TIME_END: "21:55", TENPO_NAME: "恵比寿", STUDIO_NAME: "2st", GENRE_SUB_NAME: "JAZZ HIPHOP", LEVEL_NAME: "入門", INSTRUCTOR_NAME: "木村 愛", NICKNAME: "ai", HIDUKE: "20260423", URL: "https://example.com/16", INSTRUCTOR_IMG: "" }
            ]
          }
        ]
      },
      {
        YOUBI: "FRI",
        time_list: [
          {
            record: [
              { SEQ: 17, Y_TIME_START: "13:00", Y_TIME_END: "14:25", TENPO_NAME: "新宿", STUDIO_NAME: "3st", GENRE_SUB_NAME: "HOUSE", LEVEL_NAME: "入門", INSTRUCTOR_NAME: "林 大樹", NICKNAME: "DAIKI", HIDUKE: "20260424", URL: "https://example.com/17", INSTRUCTOR_IMG: "" },
              { SEQ: 18, Y_TIME_START: "16:00", Y_TIME_END: "17:25", TENPO_NAME: "渋谷", STUDIO_NAME: "Ast", GENRE_SUB_NAME: "HIPHOP", LEVEL_NAME: "初級", INSTRUCTOR_NAME: "清水 翔太", NICKNAME: "shota", HIDUKE: "20260424", URL: "https://example.com/18", INSTRUCTOR_IMG: "" },
              { SEQ: 19, Y_TIME_START: "18:00", Y_TIME_END: "19:25", TENPO_NAME: "御茶ノ水", STUDIO_NAME: "1st", GENRE_SUB_NAME: "K-POP", LEVEL_NAME: "超入門", INSTRUCTOR_NAME: "山崎 葵", NICKNAME: "aoi", HIDUKE: "20260424", URL: "https://example.com/19", INSTRUCTOR_IMG: "" },
              { SEQ: 20, Y_TIME_START: "20:00", Y_TIME_END: "21:25", TENPO_NAME: "池袋", STUDIO_NAME: "Bst", GENRE_SUB_NAME: "JAZZ", LEVEL_NAME: "中級", INSTRUCTOR_NAME: "池田 恵", NICKNAME: "MEGUMI", HIDUKE: "20260424", URL: "https://example.com/20", INSTRUCTOR_IMG: "" }
            ]
          }
        ]
      }
    ]
  }
};

// ==========================================
// API取得関数
// ==========================================
const fetchLessonData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyApiResponse);
    }, 600);
  });
};

const App = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // モーダルの開閉状態
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // アコーディオンの開閉状態 (開いているセクションのkeyを配列で保持)
  const [expandedSections, setExpandedSections] = useState([]);

  // フィルター状態 (複数選択可能にするため配列で保持)
  const [filters, setFilters] = useState({
    youbi: [],
    timeHour: [],
    tenpo: [],
    genre: [],
    level: []
  });

  const flattenData = (json) => {
    const result = [];
    if (!json || !json.body || !Array.isArray(json.body.Items)) return result;

    json.body.Items.forEach(dayItem => {
      const youbi = dayItem.YOUBI;
      if (Array.isArray(dayItem.time_list)) {
        dayItem.time_list.forEach(timeItem => {
          if (Array.isArray(timeItem.record)) {
            timeItem.record.forEach(record => {
              const startHour = record.Y_TIME_START ? record.Y_TIME_START.split(':')[0] : '';
              result.push({
                id: record.SEQ || crypto.randomUUID(),
                youbi: youbi,
                startHour: startHour,
                timeStart: record.Y_TIME_START,
                timeEnd: record.Y_TIME_END,
                tenpoName: record.TENPO_NAME,
                studioName: record.STUDIO_NAME,
                genreName: record.GENRE_SUB_NAME,
                levelName: record.LEVEL_NAME,
                instructorName: record.INSTRUCTOR_NAME,
                instructorImg: record.INSTRUCTOR_IMG,
                nickname: record.NICKNAME,
                url: record.URL,
                date: record.HIDUKE,
                _raw: record
              });
            });
          }
        });
      }
    });
    return result;
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const json = await fetchLessonData();
      const flatData = flattenData(json);
      if (flatData.length === 0) {
        setError('有効なレコードが見つかりませんでした。');
      } else {
        setData(flatData);
      }
    } catch (err) {
      setError('データの取得に失敗しました。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // モーダル表示中の背景スクロール制御
  useEffect(() => {
    if (isFilterModalOpen || selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // クリーンアップ
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFilterModalOpen, selectedItem]);

  // フィルター用オプションの抽出
  const filterOptions = useMemo(() => {
    const options = {
      tenpo: new Set(),
      genre: new Set(),
      level: new Set(),
      youbi: new Set(),
      timeHour: new Set()
    };

    data.forEach(item => {
      if (item.tenpoName) options.tenpo.add(item.tenpoName);
      if (item.genreName) options.genre.add(item.genreName);
      if (item.levelName) options.level.add(item.levelName);
      if (item.youbi) options.youbi.add(item.youbi);
      if (item.startHour) options.timeHour.add(item.startHour);
    });

    return {
      tenpo: Array.from(options.tenpo).sort(),
      genre: Array.from(options.genre).sort(),
      level: Array.from(options.level).sort(),
      youbi: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].filter(y => options.youbi.has(y)),
      timeHour: Array.from(options.timeHour).sort((a, b) => parseInt(a) - parseInt(b))
    };
  }, [data]);

  // フィルタリング適用 (同一カテゴリ内はOR、カテゴリ間はAND)
  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (filters.tenpo.length > 0 && !filters.tenpo.includes(item.tenpoName)) return false;
      if (filters.genre.length > 0 && !filters.genre.includes(item.genreName)) return false;
      if (filters.level.length > 0 && !filters.level.includes(item.levelName)) return false;
      if (filters.youbi.length > 0 && !filters.youbi.includes(item.youbi)) return false;
      if (filters.timeHour.length > 0 && !filters.timeHour.includes(item.startHour)) return false;
      return true;
    });
  }, [data, filters]);

  // チェックボックスの切り替え処理
  const toggleFilter = (category, value) => {
    setFilters(prev => {
      const currentValues = prev[category];
      const isSelected = currentValues.includes(value);
      return {
        ...prev,
        [category]: isSelected
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value]
      };
    });
  };

  // 特定のフィルターを削除
  const removeFilter = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].filter(v => v !== value)
    }));
  };

  // 選択中のフィルターをすべてクリア
  const clearAllFilters = () => {
    setFilters({ youbi: [], timeHour: [], tenpo: [], genre: [], level: [] });
  };

  // 特定のカテゴリをすべて選択
  const selectAllInCategory = (category) => {
    const allOptions = filterOptions[category];
    setFilters(prev => ({
      ...prev,
      [category]: [...allOptions]
    }));
  };

  // 特定のカテゴリをすべて解除
  const clearCategory = (category) => {
    setFilters(prev => ({
      ...prev,
      [category]: []
    }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    return `${dateStr.slice(0, 4)}/${dateStr.slice(4, 6)}/${dateStr.slice(6, 8)}`;
  };

  // アコーディオンの開閉を切り替える
  const toggleAccordion = (key) => {
    setExpandedSections(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  // フィルター設定ボタン（横スクロール用）
  const filterButtons = [
    { key: 'youbi', label: '曜日', options: filterOptions.youbi },
    { key: 'timeHour', label: '時間', options: filterOptions.timeHour },
    { key: 'tenpo', label: '店舗', options: filterOptions.tenpo },
    { key: 'genre', label: 'ジャンル', options: filterOptions.genre },
    { key: 'level', label: 'レベル', options: filterOptions.level },
  ];

  // 選択中の全条件をフラットなリストにする（バッジ表示用）
  const activeFilterTags = useMemo(() => {
    const tags = [];
    Object.keys(filters).forEach(category => {
      filters[category].forEach(val => {
        tags.push({ category, value: val, displayValue: category === 'timeHour' ? `${val}:00台` : val });
      });
    });
    return tags;
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-20 md:pb-0 relative">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            NOA Viewer
          </h1>
          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* 選択中の条件バッジ表示エリア */}
        {activeFilterTags.length > 0 && (
          <div className="max-w-3xl mx-auto px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center gap-2">
            <span className="text-xs text-gray-500 flex-shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" /> 条件:
            </span>
            <div className="flex-1 overflow-x-auto whitespace-nowrap hide-scrollbar flex items-center gap-2">
              {activeFilterTags.map((tag, idx) => (
                <span
                  key={`${tag.category}-${tag.value}-${idx}`}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white border border-gray-200 text-xs text-gray-700 shadow-sm shrink-0"
                >
                  {tag.displayValue}
                  <button
                    onClick={() => removeFilter(tag.category, tag.value)}
                    className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <button
              onClick={clearAllFilters}
              className="text-xs text-blue-600 hover:underline flex-shrink-0 ml-1"
            >
              クリア
            </button>
          </div>
        )}
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200 text-sm">
            {error}
          </div>
        )}

        {isLoading && data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <RefreshCw className="w-8 h-8 animate-spin mb-4 text-blue-500" />
            <p className="text-sm">データを読み込み中...</p>
          </div>
        ) : data.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-sm">データがありません</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <span className="text-xs font-medium text-gray-500">
                {filteredData.length} 件表示
              </span>
            </div>

            <ul className="divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <li className="p-8 text-center text-sm text-gray-500">条件に一致するデータがありません</li>
              ) : (
                filteredData.map(item => (
                  <li
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="p-4 active:bg-gray-50 md:hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        {/* 曜日・時間・店舗 */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                          <div className="flex items-center gap-1.5 font-medium text-gray-900">
                            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                              {item.youbi}
                            </span>
                            {item.timeStart} - {item.timeEnd}
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <MapPin className="w-3.5 h-3.5" />
                            {item.tenpoName} <span className="text-xs text-gray-400">{item.studioName}</span>
                          </div>
                        </div>

                        {/* インストラクター・ジャンル・レベル */}
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                          <div className="font-bold text-gray-900 flex items-center gap-1.5 text-base">
                            <User className="w-4 h-4 text-gray-400" />
                            {item.instructorName}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                              {item.genreName}
                            </span>
                            <span className="text-xs border border-gray-200 px-2 py-0.5 rounded-full text-gray-500">
                              {item.levelName}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0 mt-2" />
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </main>

      {/* フローティングアクションボタン (FAB) */}
      <button
        onClick={() => setIsFilterModalOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform active:scale-95 z-30 flex items-center justify-center"
      >
        <Filter className="w-6 h-6" />
      </button>

      {/* 浮き出し型フィルターモーダル */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 背景の半透明ブラー領域（タップで閉じる） */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsFilterModalOpen(false)}
          />

          {/* モーダル本体 */}
          <div className="relative bg-white w-full max-w-md max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* モーダルヘッダー */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shrink-0">
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-bold text-gray-900">絞り込み</h2>
              <button
                onClick={clearAllFilters}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 px-2 py-1"
              >
                クリア
              </button>
            </div>

            {/* アコーディオンリスト */}
            <div className="flex-1 overflow-y-auto bg-gray-50 pb-4">
              <div className="divide-y divide-gray-200 bg-white border-y border-gray-200 mt-2">
                {filterButtons.map(section => {
                  const isExpanded = expandedSections.includes(section.key);
                  const selectedCount = filters[section.key].length;

                  return (
                    <div key={section.key} className="bg-white">
                      <button
                        onClick={() => toggleAccordion(section.key)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{section.label}</span>
                          {selectedCount > 0 && (
                            <span className="bg-blue-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                              {selectedCount}
                            </span>
                          )}
                        </div>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1">
                          <div className="flex gap-4 mb-3 pb-3 border-b border-gray-100">
                            <button
                              onClick={() => selectAllInCategory(section.key)}
                              className="text-sm text-blue-600 font-medium hover:underline"
                            >
                              すべて選択
                            </button>
                            <button
                              onClick={() => clearCategory(section.key)}
                              className="text-sm text-gray-500 font-medium hover:underline"
                            >
                              すべて解除
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {section.options.map(option => {
                              const isSelected = filters[section.key].includes(option);
                              const displayLabel = section.key === 'timeHour' ? `${option}:00台` : option;
                              return (
                                <button
                                  key={option}
                                  onClick={() => toggleFilter(section.key, option)}
                                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${isSelected
                                      ? 'bg-blue-50 border-blue-600 text-blue-700'
                                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                  {displayLabel}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* フッター固定ボタン */}
            <div className="p-4 bg-white border-t border-gray-200 shrink-0">
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-lg shadow-sm transition-colors"
              >
                {filteredData.length}件のレッスンを見る
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 詳細モーダル (浮き出し型に統一) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 背景の半透明ブラー領域（タップで閉じる） */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          />

          {/* モーダル本体 */}
          <div
            className="relative bg-white w-full max-w-md max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-100 px-4 py-3 flex justify-between items-center z-10 shrink-0">
              <h3 className="font-bold text-gray-900">レッスン詳細</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-5">
              <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-gray-100">
                {selectedItem.instructorImg ? (
                  <img src={selectedItem.instructorImg} alt={selectedItem.instructorName} className="w-24 h-24 object-cover rounded-full shadow-md bg-gray-100 mb-3" />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center shadow-md mb-3 border-2 border-white">
                    <User className="w-10 h-10 text-gray-300" />
                  </div>
                )}
                <h4 className="text-xl font-bold text-gray-900">{selectedItem.instructorName}</h4>
                {selectedItem.nickname && <p className="text-sm text-gray-500 mb-3">({selectedItem.nickname})</p>}

                <div className="flex items-center gap-2 justify-center mt-1">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {selectedItem.genreName}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium border border-gray-200 text-gray-600">
                    {selectedItem.levelName}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-0.5">日付</div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(selectedItem.date)} <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded text-xs ml-1 font-mono">{selectedItem.youbi}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-0.5">時間</div>
                    <div className="text-sm font-bold text-gray-900">
                      {selectedItem.timeStart} - {selectedItem.timeEnd}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-0.5">場所</div>
                    <div className="text-sm font-medium text-gray-900">
                      {selectedItem.tenpoName} <span className="text-gray-500 text-xs ml-1">{selectedItem.studioName}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedItem.url && (
                <div className="mt-6">
                  <a
                    href={selectedItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3.5 px-4 bg-gray-900 hover:bg-gray-800 text-white text-center rounded-xl font-bold shadow-sm transition-transform active:scale-[0.98]"
                  >
                    公式サイトで予約・確認する
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* スタイル定義 (横スクロールバー非表示用) */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default App;
