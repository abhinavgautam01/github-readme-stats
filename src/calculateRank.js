/**
 * Calculates the exponential cdf.
 *
 * @param {number} x The value.
 * @returns {number} The exponential cdf.
 */
function exponential_cdf(x) {
  return 1 - 2 ** -x;
}

/**
 * Calculates the log normal cdf.
 *
 * @param {number} x The value.
 * @returns {number} The log normal cdf.
 */
function log_normal_cdf(x) {
  return x / (1 + x);
}

/**
 * Calculates the user's rank.
 *
 * Developer-focused formula:
 * - Rewards PRs heavily
 * - Rewards contributing across repositories
 * - Rewards commits
 * - Stars/followers have minimal impact
 */
function calculateRank({
  all_commits,
  commits = 0,
  prs = 0,
  issues = 0,
  reviews = 0,
  repos = 0,
  stars = 0,
  followers = 0,
}) {
  const COMMITS_MEDIAN = all_commits ? 1000 : 250;
  const COMMITS_WEIGHT = 3;

  const PRS_MEDIAN = 40;
  const PRS_WEIGHT = 6;

  const ISSUES_MEDIAN = 25;
  const ISSUES_WEIGHT = 1;

  const REVIEWS_MEDIAN = 5;
  const REVIEWS_WEIGHT = 2;

  const REPOS_MEDIAN = 15;
  const REPOS_WEIGHT = 5;

  const STARS_MEDIAN = 100;
  const STARS_WEIGHT = 1;

  const FOLLOWERS_MEDIAN = 50;
  const FOLLOWERS_WEIGHT = 1;

  const TOTAL_WEIGHT =
    COMMITS_WEIGHT +
    PRS_WEIGHT +
    ISSUES_WEIGHT +
    REVIEWS_WEIGHT +
    REPOS_WEIGHT +
    STARS_WEIGHT +
    FOLLOWERS_WEIGHT;

  const score =
    COMMITS_WEIGHT * exponential_cdf(commits / COMMITS_MEDIAN) +
    PRS_WEIGHT * exponential_cdf(prs / PRS_MEDIAN) +
    ISSUES_WEIGHT * exponential_cdf(issues / ISSUES_MEDIAN) +
    REVIEWS_WEIGHT * exponential_cdf(reviews / REVIEWS_MEDIAN) +
    REPOS_WEIGHT * exponential_cdf(repos / REPOS_MEDIAN) +
    STARS_WEIGHT * log_normal_cdf(stars / STARS_MEDIAN) +
    FOLLOWERS_WEIGHT * log_normal_cdf(followers / FOLLOWERS_MEDIAN);

  const rank = 1 - score / TOTAL_WEIGHT;

  const THRESHOLDS = [1, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
  const LEVELS = ["S", "A+", "A", "A-", "B+", "B", "B-", "C+", "C"];

  const level =
    LEVELS[
      THRESHOLDS.findIndex((threshold) => rank * 100 <= threshold)
    ];

  return {
    level,
    percentile: Number((rank * 100).toFixed(2)),
  };
}

export { calculateRank };
export default calculateRank;
