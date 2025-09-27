// mockGeminiResponses.js
export const mockGeminiResponses = [
  // --- Cold Email Generator ---
  {
    feature: "Cold Email Generator",
    type: "personalized_email",
    input: { recipient: "John Doe", company: "Acme Corp", industry: "SaaS" },
    outputs: [
      "Hi John, I noticed Acme Corp is leading in SaaS innovation. I’d love to discuss how our tools can enhance your workflow...",
      "Hello John, I hope all is well! I’m reaching out to share a solution that can streamline Acme Corp's SaaS operations...",
      "Hey John, Acme Corp’s SaaS projects are impressive. Let me show you a way to boost efficiency and reduce costs..."
    ]
  },
  {
    feature: "Cold Email Generator",
    type: "subject_line",
    input: { company: "Acme Corp", type: "sales" },
    outputs: [
      "Boost Acme Corp’s SaaS Efficiency by 30% — Let’s Talk!",
      "Acme Corp Growth Made Simple: Discover Our SaaS Solutions",
      "Maximize Acme Corp Productivity Today with Proven Tools"
    ]
  },
  {
    feature: "Cold Email Generator",
    type: "tone_friendly",
    input: { recipient: "Jane Smith", company: "BetaTech", industry: "AI" },
    outputs: [
      "Hey Jane! Hope your AI projects are going great! I wanted to share a quick tip that could save BetaTech hours each week...",
      "Hi Jane, just dropping by to share a cool idea for BetaTech's AI workflow. Let me know what you think!",
      "Hello Jane! Excited about your AI work at BetaTech. Here’s a simple suggestion to boost your efficiency..."
    ]
  },
  {
    feature: "Cold Email Generator",
    type: "call_to_action",
    input: { recipient: "Mark", company: "NextGen Inc" },
    outputs: [
      "Schedule a 15-minute call to see how we can help!",
      "Click here to start your free trial today!",
      "Reply to this email and let's set up a quick demo!"
    ]
  },
  {
    feature: "Cold Email Generator",
    type: "bulk_email",
    input: { company: "TechNova", industry: "Cloud" },
    outputs: [
      "Email 1: Personalized intro with SaaS benefit.\nEmail 2: Follow-up with case study link.\nEmail 3: CTA for demo request.",
      "Email 1: Friendly greeting + service highlight.\nEmail 2: Problem-solving example.\nEmail 3: Invite for consultation.",
      "Email 1: Industry-specific insight.\nEmail 2: Testimonial reference.\nEmail 3: CTA for scheduling call."
    ]
  },

  // --- Hashtag & Caption Generator ---
  {
    feature: "Hashtag & Caption Generator",
    type: "caption",
    input: { topic: "fitness", tone: "motivational", length: "short" },
    outputs: [
      "Push your limits, smash your goals! 💪 #FitnessMotivation #GymLife #StayStrong",
      "Every rep counts! Keep going and achieve greatness. 🏋️‍♂️ #WorkoutDaily #FitLife",
      "Strive for progress, not perfection! 💥 #NoPainNoGain #FitnessJourney"
    ]
  },
  {
    feature: "Hashtag & Caption Generator",
    type: "hashtag_grouping",
    input: { topic: "vegan food" },
    outputs: [
      { high_reach: ["#VeganLife", "#PlantBased"], niche: ["#VeganRecipes", "#EcoEating"], trending: ["#HealthyEats", "#VeganChallenge"] },
      { high_reach: ["#GoVegan", "#HealthyLifestyle"], niche: ["#VeganDesserts", "#PlantBasedMeals"], trending: ["#FoodieChallenge", "#EcoFood"] },
      { high_reach: ["#VeganPower", "#PlantStrong"], niche: ["#VeganCookingTips", "#SustainableEating"], trending: ["#VeganChallenge2025", "#HealthyEatsDaily"] }
    ]
  },
  {
    feature: "Hashtag & Caption Generator",
    type: "emoji_suggestions",
    input: { topic: "travel", length: "medium" },
    outputs: [
      "✈️🌍🗺️ Ready for your next adventure? Explore hidden gems! #TravelGoals #Wanderlust",
      "Pack your bags! 🌄🏖️ Discover amazing destinations this year. #AdventureTime #TravelLife",
      "Journey awaits! 🏔️🚢 Explore the world and make memories. #ExploreMore #TravelAddict"
    ]
  },
  {
    feature: "Hashtag & Caption Generator",
    type: "trend_analysis",
    input: { topic: "tech gadgets" },
    outputs: [
      "Trending now: #SmartHome #AIRevolution #WearableTech",
      "Hot tags: #TechNews #GadgetGoals #InnovationDaily",
      "Popular: #NextGenTech #IoTDevices #FutureGadgets"
    ]
  },
  {
    feature: "Hashtag & Caption Generator",
    type: "caption_multilingual",
    input: { topic: "coffee" },
    outputs: [
      "Start your day right! ☕ #MorningCoffee #CoffeeLovers",
      "¡Empieza tu día con energía! ☕ #Café #AmantesDelCafé",
      "Commencez votre journée avec un café parfait! ☕ #CaféDuMatin #PassionCafé"
    ]
  },

  // --- AI Review / Text Enhancer ---
  {
    feature: "AI Review / Text Enhancer",
    type: "grammar_correction",
    input: "This product are amazing and works perfect.",
    outputs: [
      "This product is amazing and works perfectly.",
      "This product works perfectly and is amazing.",
      "Amazing product! It works perfectly as expected."
    ]
  },
  {
    feature: "AI Review / Text Enhancer",
    type: "tone_persuasive",
    input: "Our service helps you save time.",
    outputs: [
      "Imagine saving hours every week effortlessly — our service makes it possible!",
      "Maximize your productivity and save time with our solution today!",
      "Don’t waste another minute — our service guarantees time savings for you!"
    ]
  },
  {
    feature: "AI Review / Text Enhancer",
    type: "summarization",
    input: "The new camera has a great zoom, excellent battery life, and compact design. It's perfect for travel and casual photography. Users love its durability.",
    outputs: [
      "Compact, durable, with great zoom and battery life — perfect for travel photography.",
      "Excellent camera with zoom, battery, and portability for travel use.",
      "Travel-friendly camera: long battery, great zoom, and durable design."
    ]
  },
  {
    feature: "AI Review / Text Enhancer",
    type: "keyword_optimization",
    input: "This phone is very good for photography and gaming.",
    outputs: [
      "Optimized: 'Best smartphone for photography and gaming enthusiasts.'",
      "Optimized: 'High-performance phone ideal for photography and gaming.'",
      "Optimized: 'Top smartphone for photography and gaming experience.'"
    ]
  },
  {
    feature: "AI Review / Text Enhancer",
    type: "sentiment_analysis",
    input: "The restaurant had slow service but amazing food.",
    outputs: [
      "Mixed sentiment: Highlight amazing food and acknowledge service delay.",
      "Positive spin: Focus on delicious dishes while noting minor service issue.",
      "Balanced: Great food with slightly slow service experience."
    ]
  }
];