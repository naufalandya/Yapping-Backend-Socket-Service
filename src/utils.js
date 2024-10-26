// utils.js
function getProductivitySummary(totalDuration) {
    // Konversi durasi ke menit
    const durationInMinutes = Math.floor(totalDuration / 60);
    
    // Daftar rekomendasi kegiatan positif
    const activities = {
      "6-10": [
        "You could have read 5 pages of a biology book by 'Author'.",
        "This time could have been spent doing a 5-minute meditation session.",
        "You could have organized your workspace for a more productive environment.",
        "This time could have been used for a quick stretching routine to stay fit.",
        "You could have explored a new vocabulary list in a foreign language."
      ],
      "11-15": [
        "You could have written down three personal goals to achieve this month.",
        "This time could have been used to prepare a healthy snack.",
        "You could have taken a quick walk around your block for some fresh air.",
        "You could have watched an insightful TED talk or short educational video.",
        "This time was enough to make a detailed to-do list for your day."
      ],
      "16-20": [
        "You could have read 10 pages of a novel by 'Author' or an interesting article.",
        "This time could have been used to listen to a motivational podcast.",
        "You could have done a brief workout or stretching session.",
        "You could have practiced mindfulness or gratitude journaling.",
        "You could have reviewed key concepts in a recent lesson or lecture."
      ],
      "21-25": [
        "You could have reviewed the basics of a new skill you've been meaning to learn.",
        "This time was enough to practice a language for daily conversation.",
        "You could have written a short blog post or journal entry.",
        "You could have explored a new recipe and prepared a quick meal.",
        "This time could have been spent reading industry news to stay informed."
      ],
      "26-30": [
        "This was enough time to go over a module in an online course.",
        "You could have written a letter or email to an old friend.",
        "You could have completed a guided meditation session for relaxation.",
        "This time was enough for a comprehensive workout routine.",
        "You could have outlined your upcoming project or creative ideas."
      ],
      "31-35": [
        "This was enough time to plan a creative project step-by-step.",
        "You could have read an informative article on a topic of interest.",
        "You could have gone on a short nature walk to recharge.",
        "This time was enough for practicing a musical instrument.",
        "You could have organized your day or week in a planner."
      ],
      "36-40": [
        "This time was enough for an in-depth session of self-reflection or journaling.",
        "You could have learned a new cooking recipe from scratch.",
        "This was enough time to study a concept you find challenging.",
        "You could have practiced 20 minutes of yoga or physical exercise.",
        "You could have drafted a personal budget for your expenses."
      ],
      "41-50": [
        "This was enough time to brainstorm and plan a side project.",
        "You could have read several chapters of a non-fiction book.",
        "This time could have been used to tidy up your home or workspace.",
        "You could have reviewed your financial goals and budgeted accordingly.",
        "You could have taken a longer walk or bike ride to unwind."
      ],
      "51-60": [
        "You could have completed a mini-course or online tutorial.",
        "This time was enough to work through a coding problem or challenge.",
        "You could have worked on a craft or art project you've put off.",
        "This time could have been used for a full workout session.",
        "You could have completed a focused study session on a key topic."
      ],
      "90+": [
        "You've been online for a while! Consider taking a break to stay refreshed.",
        "It's a good time to take a digital detox and do some offline activities.",
        "You could use this time to take a rest and recharge for the day ahead.",
        "Consider spending some time with friends or family offline.",
        "A break could help you return with a fresher, clearer mind."
      ]
    };
  
    // Memilih pesan secara acak berdasarkan rentang durasi
    let summary;
    if (durationInMinutes >= 6 && durationInMinutes <= 10) {
      summary = activities["6-10"][Math.floor(Math.random() * activities["6-10"].length)];
    } else if (durationInMinutes >= 11 && durationInMinutes <= 15) {
      summary = activities["11-15"][Math.floor(Math.random() * activities["11-15"].length)];
    } else if (durationInMinutes >= 16 && durationInMinutes <= 20) {
      summary = activities["16-20"][Math.floor(Math.random() * activities["16-20"].length)];
    } else if (durationInMinutes >= 21 && durationInMinutes <= 25) {
      summary = activities["21-25"][Math.floor(Math.random() * activities["21-25"].length)];
    } else if (durationInMinutes >= 26 && durationInMinutes <= 30) {
      summary = activities["26-30"][Math.floor(Math.random() * activities["26-30"].length)];
    } else if (durationInMinutes >= 31 && durationInMinutes <= 35) {
      summary = activities["31-35"][Math.floor(Math.random() * activities["31-35"].length)];
    } else if (durationInMinutes >= 36 && durationInMinutes <= 40) {
      summary = activities["36-40"][Math.floor(Math.random() * activities["36-40"].length)];
    } else if (durationInMinutes >= 41 && durationInMinutes <= 50) {
      summary = activities["41-50"][Math.floor(Math.random() * activities["41-50"].length)];
    } else if (durationInMinutes >= 51 && durationInMinutes <= 60) {
      summary = activities["51-60"][Math.floor(Math.random() * activities["51-60"].length)];
    } else if (durationInMinutes > 61) {
      summary = activities["90+"][Math.floor(Math.random() * activities["90+"].length)];
    } else {
      summary = "Just getting started—keep going!";
    }
  
    return summary;
  }
  
  module.exports = { getProductivitySummary };
  