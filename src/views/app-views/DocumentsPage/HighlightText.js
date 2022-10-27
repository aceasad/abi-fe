import { useState, useEffect } from 'react';

const parseHighlightedBgColor = {
  low: '#ff000d',
  medium: '#fffc00',
  high: '#0dd8a3',
};

const parseHighlightedFontColor = {
  low: '#fff',
  medium: '#000',
  high: '#000',
};

const HighLightText = ({
  id,
  sessionId,
  content,
  offsetsInDocument,
  score,
  isInvertedColors,
  withScrolling,
  isHighlightingWithTags,
  offsetsTags,
  shouldSetOnComponentMounted,
  onComponentMounted,
  isHighlightedWithCursorPointer,
}) => {
  const [highlightedContent, setHighlightedContent] = useState(content);
  const [isReady, setIsReady] = useState(false);

  const handleConfidence = (score, isInvertedColors) => {
    const growingConfidence =
      score <= 33 ? 'low' : score <= 66 ? 'medium' : 'high';
    const decreasingConfidence =
      score <= 33 ? 'high' : score <= 66 ? 'medium' : 'low';
    const confidence = isInvertedColors
      ? decreasingConfidence
      : growingConfidence;

    return confidence;
  };

  useEffect(() => {
    if (offsetsInDocument.length) {
      /* Sorting the array of objects by the start property. */
      offsetsInDocument.sort((a, b) => a.start - b.start);

      /* Highlighting the text in the document. */
      const highlightedContent = offsetsInDocument.reduce(
        (contentAccumulator, offset, index) => {
          /* Getting the difference between the original content and the highlighted content. */
          const highlightedContentDiff =
            contentAccumulator.length - content.length;

          /* Getting the highlighted text. */
          const start = highlightedContentDiff + offset.start;
          const end = highlightedContentDiff + offset.end;
          const highlightedText = contentAccumulator.slice(start, end);

          /* Getting the text before and after the highlighted text. */
          const startText = contentAccumulator.slice(0, start);
          const endText = contentAccumulator.slice(end);

          /* This is for custom highlighting. */
          if (isHighlightingWithTags) {
            return (
              startText +
              `<span class="customHighlightedText ner_${offsetsTags[index]}">${highlightedText}</span>` +
              endText
            );
          }

          /* Returning the highlighted text. */
          return (
            startText +
            `<span id="output-${id}-${sessionId}" style="background-color: ${
              parseHighlightedBgColor[handleConfidence(score, isInvertedColors)]
            }; color: ${
              parseHighlightedFontColor[
                handleConfidence(score, isInvertedColors)
              ]
            }; cursor: ${
              isHighlightedWithCursorPointer ? 'pointer' : 'auto'
            }" class="defaultHighlightedText">${highlightedText}</span>` +
            endText
          );
        },
        content
      );

      setHighlightedContent(highlightedContent);
    } else {
      setHighlightedContent(content);
    }

    setIsReady(true);
    if (shouldSetOnComponentMounted) {
      onComponentMounted(true);
    }
  }, [
    id,
    sessionId,
    content,
    offsetsInDocument,
    score,
    isInvertedColors,
    isHighlightingWithTags,
    offsetsTags,
    shouldSetOnComponentMounted,
    onComponentMounted,
    isHighlightedWithCursorPointer,
  ]);

  const scrollParentToChild = (parent, child) => {
    const parentRect = parent.getBoundingClientRect();

    const parentViewableArea = {
      height: parent.clientHeight,
      width: parent.clientWidth,
    };

    const childRect = child.getBoundingClientRect();

    const isViewable =
      childRect.top >= parentRect.top &&
      childRect.top <= parentRect.top + parentViewableArea.height;

    if (!isViewable) {
      parent.scrollTop = childRect.top + parent.scrollTop - parentRect.top - 50;
    }
  };

  useEffect(() => {
    if (isReady && offsetsInDocument.length && withScrolling) {
      scrollParentToChild(
        document.getElementById('output-wrapper-' + id + '-' + sessionId),
        document.getElementById(`output-${id}-${sessionId}`)
      );
    }
  }, [isReady, id, sessionId, offsetsInDocument, withScrolling]);

  return (
    <span
      dangerouslySetInnerHTML={{ __html: highlightedContent }}
      style={{
        color: '#000',
        lineHeight: isHighlightingWithTags ? '50px' : '30px',
      }}
    />
  );
};

export default HighLightText;
