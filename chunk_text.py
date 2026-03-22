import re

def chunk_text(text, max_length=1000):
    # Split on actual newlines (not the "/n" bug that was here before)
    paragraphs = re.split(r'\n+', text)
    # Filter out empty/whitespace-only paragraphs
    paragraphs = [p.strip() for p in paragraphs if p.strip()]

    chunks = []
    current_chunk = ""

    for para in paragraphs:
        if len(current_chunk) + len(para) + 1 <= max_length:
            current_chunk += para + "\n"
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            if len(para) > max_length:
                # Paragraph is too long on its own — split by sentence
                sentences = re.split(r'(?<=[.!?]) +', para)
                temp_chunk = ""
                for sent in sentences:
                    if len(temp_chunk) + len(sent) + 1 <= max_length:
                        temp_chunk += sent + " "
                    else:
                        if temp_chunk:
                            chunks.append(temp_chunk.strip())
                        temp_chunk = sent + " "
                if temp_chunk:
                    chunks.append(temp_chunk.strip())
                current_chunk = ""
            else:
                current_chunk = para + "\n"

    if current_chunk:
        chunks.append(current_chunk.strip())

    return [c for c in chunks if c]  # Final filter for any empty strings
