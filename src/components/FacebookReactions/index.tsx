import React from "react";
import { cn } from "@/lib/utils";
import { reactionTypes } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";

type FacebookReactionsProps = {
  onReactionSelect?: (reaction: reactionTypes) => void;
  selectedReaction?: reactionTypes | null;
  children: React.ReactNode;
  isLoading: boolean
};

const FacebookReactions: React.FC<FacebookReactionsProps> = ({
  onReactionSelect,
  selectedReaction = null,
  children, isLoading
}) => {
  const handleReactionClick = (reactionName: reactionTypes) => {
    if (onReactionSelect) {
      onReactionSelect(reactionName);
    }
  };

  return (
    <div className="relative">
      <Popover placement="bottom">
        <PopoverTrigger>{children}</PopoverTrigger>

        <PopoverContent>
          <div className="relative flex items-center gap-2">
            <button
              disabled={isLoading}
              onClick={() => handleReactionClick("like")}
              className={cn(
                "relative group w-12 h-12 disabled:opacity-70 bg-[url('http://deividmarques.github.io/facebook-reactions-css/assets/images/facebook-reactions.png')] bg-no-repeat transform transition-transform scale-[0.7] hover:scale-90",
                selectedReaction === "like" && "scale-90"
              )}
            >
              <span className="absolute opacity-0 group-hover:opacity-100 left-1/2 top-[-28px] transform -translate-x-1/2 bg-gray-900 p-0.5 text-white text-xs rounded px-1 transition-opacity">
                Like
              </span>
            </button>
            <button
              disabled={isLoading}
              onClick={() => handleReactionClick("love")}
              className={cn(
                "relative group w-12 h-12 disabled:opacity-70 bg-[url('http://deividmarques.github.io/facebook-reactions-css/assets/images/facebook-reactions.png')] bg-no-repeat bg-[-48px_0] transform transition-transform scale-[0.7] hover:scale-90",
                selectedReaction === "love" && "scale-90"
              )}
            >
              <span className="absolute opacity-0 group-hover:opacity-100 left-1/2 top-[-28px] transform -translate-x-1/2 bg-gray-900 p-0.5 text-white text-xs rounded px-1 transition-opacity">
                Love
              </span>
            </button>
            <button
              disabled={isLoading}
              onClick={() => handleReactionClick("haha")}
              className={cn(
                "relative group w-12 h-12 disabled:opacity-70 bg-[url('http://deividmarques.github.io/facebook-reactions-css/assets/images/facebook-reactions.png')] bg-no-repeat bg-[-96px_0] transform transition-transform scale-[0.7] hover:scale-90",
                selectedReaction === "haha" && "scale-90"
              )}
            >
              <span className="absolute opacity-0 group-hover:opacity-100 left-1/2 top-[-28px] transform -translate-x-1/2 bg-gray-900 p-0.5 text-white text-xs rounded px-1 transition-opacity">
                Haha
              </span>
            </button>
            <button
              disabled={isLoading}
              onClick={() => handleReactionClick("wow")}
              className={cn(
                "relative group w-12 h-12 disabled:opacity-70 bg-[url('http://deividmarques.github.io/facebook-reactions-css/assets/images/facebook-reactions.png')] bg-no-repeat bg-[-144px_0] transform transition-transform scale-[0.7] hover:scale-90",
                selectedReaction === "wow" && "scale-90"
              )}
            >
              <span className="absolute opacity-0 group-hover:opacity-100 left-1/2 top-[-28px] transform -translate-x-1/2 bg-gray-900 p-0.5 text-white text-xs rounded px-1 transition-opacity">
                Wow
              </span>
            </button>
            <button
              disabled={isLoading}
              onClick={() => handleReactionClick("sad")}
              className={cn(
                "relative group w-12 h-12 disabled:opacity-70 bg-[url('http://deividmarques.github.io/facebook-reactions-css/assets/images/facebook-reactions.png')] bg-no-repeat bg-[-192px_0] transform transition-transform scale-[0.7] hover:scale-90",
                selectedReaction === "sad" && "scale-90"
              )}
            >
              <span className="absolute opacity-0 group-hover:opacity-100 left-1/2 top-[-28px] transform -translate-x-1/2 bg-gray-900 p-0.5 text-white text-xs rounded px-1 transition-opacity">
                Sad
              </span>
            </button>
            <button
              disabled={isLoading}
              onClick={() => handleReactionClick("angry")}
              className={cn(
                "relative group w-12 h-12 disabled:opacity-70 bg-[url('http://deividmarques.github.io/facebook-reactions-css/assets/images/facebook-reactions.png')] bg-no-repeat bg-[-240px_0] transform transition-transform scale-[0.7] hover:scale-90",
                selectedReaction === "angry" && "scale-90"
              )}
            >
              <span className="absolute opacity-0 group-hover:opacity-100 left-1/2 top-[-28px] transform -translate-x-1/2 bg-gray-900 p-0.5 text-white text-xs rounded px-1 transition-opacity">
                Angry
              </span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FacebookReactions;
