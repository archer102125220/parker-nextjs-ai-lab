/**
 * 判斷觸摸手勢是垂直還是水平。
 *
 * @param {Object} startPoint - 滑動開始時的座標點，包含 clientX 和 clientY。
 * @param {Object} endPoint - 滑動結束時的座標點，包含 clientX 和 clientY。
 * @param {Object} [options] - 可選的配置選項。
 * @param {number} [options.minSwipeDistance=30] - 判斷為有效滑動所需的最小距離（像素）。
 * @param {number} [options.angleThreshold=45] - 判斷為垂直或水平滑動的最大角度偏差（度）。
 * 例如，如果設置為 45，則角度在 0 +/- 45 度（即 -45 到 45 度）之間被視為水平，
 * 角度在 90 +/- 45 度（即 45 到 135 度）之間被視為垂直。
 * @returns {Object} - 包含以下屬性的物件：
 * - isHorizontal: 是否水平滑動
 * - isVertical: 是否垂直滑動
 * - originalAngleDeg: 原始角度（度）
 * - angleDeg: 映射後的角度（度）
 * - angleRad: 弧度
 * - distance: 滑動距離
 */
export function classifySwipeDirection(startPoint, endPoint, options = {}) {
  const defaultOptions = {
    minSwipeDistance: 30, // 最小滑動距離
    angleThreshold: 45    // 角度閾值，用於判斷是否接近水平或垂直 (0-90度)
  };
  const config = { ...defaultOptions, ...options };

  const dx = endPoint.clientX - startPoint.clientX;
  const dy = endPoint.clientY - startPoint.clientY;

  // 1. 計算總滑動距離 (幾何學：勾股定理)
  const distance = Math.sqrt(dx * dx + dy * dy);

  // 如果距離未達到最小滑動距離，則不判斷為有效滑動
  if (distance < config.minSwipeDistance) {
    return null;
  }

  // 2. 計算滑動的角度 (三角函數：atan2)
  // atan2(dy, dx) 返回的角度是從正X軸到點(dx, dy)的弧度，範圍從 -PI 到 PI。
  const angleRad = Math.atan2(dy, dx);
  // 將弧度轉換為度數，並確保角度在 0 到 360 度之間方便判斷
  const originalAngleDeg = Math.abs(angleRad * 180 / Math.PI); // 取絕對值，因為方向性由象限決定
  let angleDeg = originalAngleDeg;

  // 將角度映射到 0-90 度範圍，方便判斷接近水平還是垂直
  // 例如：
  // 0度 (右) -> 0
  // 90度 (下) -> 90
  // 180度 (左) -> 0
  // 270度 (上) -> 90
  if (angleDeg > 90) {
    angleDeg = 180 - angleDeg; // 將 >90 度的角度映射回 0-90 範圍
  }

  let isHorizontal = false;
  let isVertical = false;

  // 3. 根據角度閾值判斷方向
  if (angleDeg <= config.angleThreshold) {
    // 角度接近 0 度 (水平方向)
    isHorizontal = true;
  } else if (angleDeg >= (90 - config.angleThreshold)) {
    // 角度接近 90 度 (垂直方向)
    isVertical = true;
  } else {
    // 角度既不接近水平也不接近垂直，或者在閾值之間
    isHorizontal = false;
    isVertical = false;
  }

  return {
    isHorizontal,
    isVertical,
    originalAngleDeg,
    angleDeg,
    angleRad,
    distance
  };
}

export default classifySwipeDirection;