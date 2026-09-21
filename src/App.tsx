import React, { useState, useMemo } from 'react';
import './App.css';

// 타입 정의
export type StationLevel = 'major' | 'medium' | 'minor'; // 대제목, 중제목, 소제목

export interface Station {
  id: string;
  level: StationLevel;
  title: string;
  eraText: string; // 예: "BC 1446경"
  yearNum: number; // 정렬용 연도 숫 (BC는 음수, AD는 양수. 예: BC 1446 -> -1446)
  description: string;
  verses: string;
  color: string; // 선택된 글자/라인 포인트 색상
  isStarred?: boolean; // 별표 표시 여부
}

// 초기 샘플 데이터 (연도순 정렬)
const INITIAL_STATIONS: Station[] = [
  {
    id: '1',
    level: 'major',
    title: '태초의 창조와 인류의 시작',
    eraText: 'BC 4000경',
    yearNum: -4000,
    description: '하나님의 세상 창조, 아담과 하와, 타락과 구원 약속(원시복음)',
    verses: '창세기 1~3장',
    color: '#2563EB', // Blue
    isStarred: true,
  },
  {
    id: '2',
    level: 'medium',
    title: '노아의 방주와 대홍수',
    eraText: 'BC 2400경',
    yearNum: -2400,
    description: '타락한 세상에 대한 심판과 노아 가족의 구원 언약',
    verses: '창세기 6~9장',
    color: '#0284C7',
    isStarred: false,
  },
  {
    id: '3',
    level: 'major',
    title: '아브라함의 부르심 (족장 시대 시작)',
    eraText: 'BC 2000경',
    yearNum: -2000,
    description: '믿음의 조상 아브라함과의 무조건적 혜택 언약 체결 및 가나안 이동',
    verses: '창세기 12장',
    color: '#0D9488', // Teal
    isStarred: true,
  },
  {
    id: '4',
    level: 'minor',
    title: '이삭의 번제와 여호와 이레',
    eraText: 'BC 1915경',
    yearNum: -1915,
    description: '모리아 산에서의 순종과 준비하신 어린 양의 은혜',
    verses: '창세기 22장',
    color: '#059669',
    isStarred: false,
  },
  {
    id: '5',
    level: 'major',
    title: '출애굽과 유월절 구원',
    eraText: 'BC 1446경',
    yearNum: -1446,
    description: '모세를 통한 이집트 탈출, 유월절 어린 양의 피, 홍해의 기적',
    verses: '출애굽기 12~14장',
    color: '#16A34A', // Green
    isStarred: true,
  },
  {
    id: '6',
    level: 'medium',
    title: '시내산 언약과 율법 수여',
    eraText: 'BC 1446경',
    yearNum: -1445,
    description: '십계명 전달 및 하나님 임재의 성막(Tabernacle) 건립 명령',
    verses: '출애굽기 19~20장',
    color: '#65A30D',
    isStarred: false,
  },
  {
    id: '7',
    level: 'major',
    title: '통일 왕국 수립과 다윗 왕',
    eraText: 'BC 1010경',
    yearNum: -1010,
    description: '이스라엘 영토 확장 및 예루살렘 수도 지정, 다윗 언약 체결',
    verses: '사무엘하 5~7장',
    color: '#D97706', // Amber
    isStarred: true,
  },
  {
    id: '8',
    level: 'minor',
    title: '솔로몬의 성전 건축',
    eraText: 'BC 966경',
    yearNum: -966,
    description: '예루살렘 시온산 위 7년간의 첫 성전 봉헌',
    verses: '열왕기상 6장',
    color: '#EA580C',
    isStarred: false,
  },
  {
    id: '9',
    level: 'medium',
    title: '남북 분열 왕국 및 바벨론 포로',
    eraText: 'BC 586경',
    yearNum: -586,
    description: '예루살렘 성전 함락, 바벨론 70년 포로 생활 시작 및 선지자들의 예언',
    verses: '열왕기하 25장',
    color: '#DC2626', // Red
    isStarred: false,
  },
  {
    id: '10',
    level: 'major',
    title: '예수 그리스도의 성육신과 구원 완성',
    eraText: 'AD 30년경',
    yearNum: 30,
    description: '예수님의 탄생, 공생애, 십자가 대속의 죽음과 부활 및 승천',
    verses: '마태/마가/누가/요한복음',
    color: '#E11D48', // Rose
    isStarred: true,
  },
  {
    id: '11',
    level: 'medium',
    title: '오순절 성령 강림과 초대교회 형성',
    eraText: 'AD 30년경',
    yearNum: 31,
    description: '성령 임재로 시작된 오순절 교회 및 복음의 세계적 전파',
    verses: '사도행전 2장',
    color: '#9333EA', // Purple
    isStarred: false,
  },
];

// 선택 가능한 테마 색상 팔레트
const COLOR_OPTIONS = [
  '#2563EB', // Blue
  '#0D9488', // Teal
  '#16A34A', // Green
  '#D97706', // Amber
  '#E11D48', // Rose
  '#9333EA', // Purple
  '#4F46E5', // Indigo
  '#475569', // Slate
];

export default function App() {
  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);
  
  // 깊이 단계 (1: 대제목만, 2: 중제목까지, 3: 소제목까지 전체)
  const [expandLevel, setExpandLevel] = useState<number>(1);
  
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // 폼 상태
  const [formData, setFormData] = useState<Partial<Station>>({
    level: 'major',
    title: '',
    eraText: '',
    yearNum: 0,
    description: '',
    verses: '',
    color: COLOR_OPTIONS[0],
    isStarred: false,
  });

  // 연도 순 정렬된 역 리스트
  const sortedStations = useMemo(() => {
    return [...stations].sort((a, b) => a.yearNum - b.yearNum);
  }, [stations]);

  // 필터링된 역 (펼침 레벨에 맞춰 표시)
  const visibleStations = useMemo(() => {
    return sortedStations.filter((st) => {
      if (expandLevel === 1) return st.level === 'major';
      if (expandLevel === 2) return st.level === 'major' || st.level === 'medium';
      return true; // level === 3 (소제목 포함 전체)
    });
  }, [sortedStations, expandLevel]);

  // 클릭할 때마다 단계 변경 (1 -> 2 -> 3 -> 1)
  const handleToggleExpandLevel = () => {
    setExpandLevel((prev) => (prev % 3) + 1);
  };

  // 신규 등록 준비
  const handleAddNew = () => {
    setSelectedStation(null);
    setFormData({
      level: 'major',
      title: '',
      eraText: 'BC ',
      yearNum: -1000,
      description: '',
      verses: '',
      color: COLOR_OPTIONS[0],
      isStarred: false,
    });
    setIsEditing(true);
  };

  // 수정 등록 준비
  const handleEdit = (st: Station) => {
    setFormData(st);
    setIsEditing(true);
  };

  // 별표 토글
  const handleToggleStar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setStations((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isStarred: !s.isStarred } : s))
    );
  };

  // 삭제
  const handleDelete = (id: string) => {
    if (window.confirm('이 성경 역사 사건을 삭제하시겠습니까?')) {
      setStations((prev) => prev.filter((s) => s.id !== id));
      if (selectedStation?.id === id) setSelectedStation(null);
    }
  };

  // 저장 (자동 연도 정렬 처리)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (formData.id) {
      // 수정
      setStations((prev) =>
        prev.map((s) => (s.id === formData.id ? (formData as Station) : s))
      );
      if (selectedStation?.id === formData.id) {
        setSelectedStation(formData as Station);
      }
    } else {
      // 추가 (자동으로 yearNum에 맞게 순서 생성)
      const newSt: Station = {
        ...formData,
        id: Date.now().toString(),
        yearNum: Number(formData.yearNum) || 0,
      } as Station;

      setStations((prev) => [...prev, newSt]);
      setSelectedStation(newSt);
    }
    setIsEditing(false);
  };

  return (
    <div className="app-container">
      {/* 상단 스마트 헤더 */}
      <header className="app-header">
        <div className="header-badge">BIBLICAL HISTORY TIMELINE</div>
        <h1 className="app-title">성경 구속사 지하철 노선도</h1>
        <p className="app-subtitle">
          인류의 구원 역사를 세로 노선으로 직관적으로 탐색해보세요.
        </p>

        {/* 제어 버튼 영역 */}
        <div className="header-controls">
          <button
            type="button"
            className="btn btn-level-toggle"
            onClick={handleToggleExpandLevel}
          >
            <span className="level-indicator">
              현재 보기: <strong>{expandLevel === 1 ? '1단계 (대제목)' : expandLevel === 2 ? '2단계 (+중제목)' : '3단계 (전체 상세)'}</strong>
            </span>
            <span className="click-hint">👈 클릭하여 보기 단계 전환</span>
          </button>

          <button type="button" className="btn btn-add" onClick={handleAddNew}>
            + 사건/역 추가
          </button>
        </div>
      </header>

      {/* 메인 콘텐츠 그리드 */}
      <div className="main-grid">
        {/* 세로 지하철 노선도 뷰 */}
        <main className="subway-view">
          <div className="subway-timeline">
            {visibleStations.map((station, index) => {
              const isSelected = selectedStation?.id === station.id;

              return (
                <div
                  key={station.id}
                  className={`station-item level-${station.level} ${
                    isSelected ? 'is-selected' : ''
                  }`}
                  onClick={() => setSelectedStation(station)}
                >
                  {/* 연도 표시 컬럼 */}
                  <div className="col-era">
                    <span className="era-badge">{station.eraText}</span>
                  </div>

                  {/* 세로 노선 트랙 컬럼 */}
                  <div className="col-track">
                    {/* 연속되는 세로 연결 라인 */}
                    {index < visibleStations.length - 1 && (
                      <div
                        className="track-line"
                        style={{ backgroundColor: station.color }}
                      />
                    )}

                    {/* 노선 역 노드 (포인트) */}
                    <div
                      className={`track-node node-${station.level}`}
                      style={{
                        borderColor: station.color,
                        backgroundColor: isSelected ? station.color : '#FFFFFF',
                      }}
                    >
                      {station.level === 'major' && <div className="inner-dot" />}
                    </div>
                  </div>

                  {/* 역 정보 콘텐츠 컬럼 */}
                  <div className="col-content">
                    <div
                      className="station-card"
                      style={{ borderLeftColor: station.color }}
                    >
                      <div className="card-top">
                        <span
                          className="level-tag"
                          style={{ backgroundColor: station.color }}
                        >
                          {station.level === 'major'
                            ? '대제목'
                            : station.level === 'medium'
                            ? '중제목'
                            : '소제목'}
                        </span>

                        {/* 별표 토글 버튼 */}
                        <button
                          type="button"
                          className={`star-btn ${station.isStarred ? 'starred' : ''}`}
                          onClick={(e) => handleToggleStar(e, station.id)}
                          title="중요 사건 별표"
                        >
                          ★
                        </button>
                      </div>

                      <h3
                        className="station-title"
                        style={{ color: station.color }}
                      >
                        {station.title}
                      </h3>

                      {station.description && (
                        <p className="station-desc">{station.description}</p>
                      )}

                      {station.verses && (
                        <span className="verse-tag">📖 {station.verses}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* 오른쪽 상세 및 편집 패널 */}
        <aside className="side-panel">
          {isEditing ? (
            /* 수정/추가 폼 */
            <div className="panel-box form-box">
              <h2>{formData.id ? '사건/역 수정' : '새 사건/역 추가'}</h2>
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label>분류 단계 (계층)</label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        level: e.target.value as StationLevel,
                      })
                    }
                  >
                    <option value="major">대제목 (큰 뿌리/주요 시대)</option>
                    <option value="medium">중제목 (하위 단락/주요 사건)</option>
                    <option value="minor">소제목 (세밀한 추가 정보)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>제목</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="제목을 입력하세요"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>표시 연도</label>
                    <input
                      type="text"
                      value={formData.eraText || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, eraText: e.target.value })
                      }
                      placeholder="예: BC 1446경"
                    />
                  </div>

                  <div className="form-group">
                    <label>정렬용 연도 (숫자)</label>
                    <input
                      type="number"
                      required
                      value={formData.yearNum ?? 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          yearNum: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      placeholder="BC는 음수(-1446), AD는 양수(30)"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>관련 성경 구절</label>
                  <input
                    type="text"
                    value={formData.verses || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, verses: e.target.value })
                    }
                    placeholder="예: 창세기 12:1-3"
                  />
                </div>

                <div className="form-group">
                  <label>설명 및 내용</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    placeholder="상세 내용을 적어주세요."
                  />
                </div>

                {/* 색상 선택기 */}
                <div className="form-group">
                  <label>포인트 글자/노선 색상</label>
                  <div className="color-picker-grid">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={`color-chip ${
                          formData.color === c ? 'active' : ''
                        }`}
                        style={{ backgroundColor: c }}
                        onClick={() => setFormData({ ...formData, color: c })}
                      />
                    ))}
                  </div>
                </div>

                {/* 별표 설정 */}
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isStarred || false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isStarred: e.target.checked,
                        })
                      }
                    />
                    ⭐ 주요 사건으로 별표 등록
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-save">
                    저장하기
                  </button>
                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={() => setIsEditing(false)}
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          ) : selectedStation ? (
            /* 상세 내용 패널 */
            <div className="panel-box detail-box">
              <div className="detail-header">
                <span className="detail-era">{selectedStation.eraText}</span>
                {selectedStation.isStarred && <span className="star-icon">⭐</span>}
              </div>

              <h2 style={{ color: selectedStation.color }}>
                {selectedStation.title}
              </h2>

              {selectedStation.verses && (
                <p className="detail-verses">📖 {selectedStation.verses}</p>
              )}

              <hr className="divider" />

              <p className="detail-desc">{selectedStation.description}</p>

              <div className="panel-actions">
                <button
                  type="button"
                  className="btn btn-edit"
                  onClick={() => handleEdit(selectedStation)}
                >
                  ✏️ 수정하기
                </button>
                <button
                  type="button"
                  className="btn btn-delete"
                  onClick={() => handleDelete(selectedStation.id)}
                >
                  🗑️ 삭제
                </button>
              </div>
            </div>
          ) : (
            /* 미선택 안내 */
            <div className="panel-box empty-box">
              <div className="empty-icon">🗺️</div>
              <p>노선도의 역(사건)을 클릭하면 상세 내용을 수정하거나 확인할 수 있습니다.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}