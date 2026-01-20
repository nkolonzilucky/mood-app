export const moodEmoji = (level: number) => {
  const map = {
    0: ["🤮😢", "very bad", "what are your symptoms?"],
    1: ["😢", "crying", "what made you cry?"],
    2: ["🙁", "sad", "why are you sad?"],
    3: ["😐", "neutral", "what can be improved to make you happy?"],
    4: ["🙂", "what made you so happy right now? :)"],
    5: ["🤩", "What are you celebrating right now? :)"],
  };
  return map[level as keyof typeof map];
};