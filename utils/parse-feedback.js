// utils/parse-feedback.js

module.exports = function parseFeedback(raw) {
    const lines = raw
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => /^\d+\./.test(line));
  
    const answer1 = lines.find(l => l.startsWith("1."))?.replace(/^1\.\s*/, '') || '';
    const answer2 = lines.find(l => l.startsWith("2."))?.replace(/^2\.\s*/, '') || '';
    const answer3 = lines.find(l => l.startsWith("3."))?.replace(/^3\.\s*/, '') || '';
    const answer4 = lines.find(l => l.startsWith("4."))?.replace(/^4\.\s*/, '') || '';
    const answer5 = lines.find(l => l.startsWith("5."))?.replace(/^5\.\s*/, '') || '';
    const answer6 = lines.find(l => l.startsWith("6."))?.replace(/^6\.\s*/, '') || '';
    const answer7 = lines.find(l => l.startsWith("7."))?.replace(/^7\.\s*/, '') || '';
    const answer8 = lines.find(l => l.startsWith("8."))?.match(/Score:\s*["“]?(\d)["”]?/)?.[1] || '';
  
    return {
      score: Number(answer8),
      header: answer7,
      body: answer6,
      mvp: {
        phrase: answer2,
        why: answer3
      },
      missed: {
        phrase: answer4,
        why: answer5
      },
      full_analysis: answer1,
      feedback_id: "test-feedback-id",
      feedback_url: "https://emmo.life/feedback/test"
    };
  };
  