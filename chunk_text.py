import re
def chunk_text(text, max_length=1000):
    paragraph = re.split(r'\n+', text)
    chunks = []
    current_chunk = ""

    for para in paragraph:
        if len(current_chunk) + len(para) + 1 <= max_length:
            current_chunk += para + "/n"
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            if len(para) > max_length:
                sentences = re.split(r'(?<=[.!?]) +', para)
                temp_chunk = ""
                for sent in sentences:
                    if len(temp_chunk) + len(sent) + 1 <= max_length:
                        temp_chunk += sent + " "
                    else:
                        chunks.append(temp_chunk.strip())
                        temp_chunk = sent + " "
                if temp_chunk:
                    chunks.append(temp_chunk.strip())
                current_chunk = ""
            else:
                current_chunk = para + "\n"
    if current_chunk:
        chunks.append(current_chunk.strip())
    return chunks

