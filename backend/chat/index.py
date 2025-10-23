import json
import os
from typing import Dict, Any, List
from pydantic import BaseModel, Field

class Message(BaseModel):
    role: str = Field(..., pattern='^(user|assistant|system)$')
    content: str = Field(..., min_length=1)

class ChatRequest(BaseModel):
    messages: List[Message]
    mode: str = Field(..., pattern='^(text|image|video)$')

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: OpenAI GPT chat endpoint for text, image and video generation
    Args: event - dict with httpMethod, body, headers
          context - object with request_id, function_name attributes
    Returns: HTTP response with AI-generated content
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'OpenAI API key not configured'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    chat_request = ChatRequest(**body_data)
    
    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        
        if chat_request.mode == 'text':
            response = client.chat.completions.create(
                model='gpt-4o-mini',
                messages=[{'role': msg.role, 'content': msg.content} for msg in chat_request.messages],
                temperature=0.7,
                max_tokens=1000
            )
            
            result = {
                'type': 'text',
                'content': response.choices[0].message.content,
                'model': 'gpt-4o-mini'
            }
            
        elif chat_request.mode == 'image':
            user_prompt = next((msg.content for msg in chat_request.messages if msg.role == 'user'), '')
            
            response = client.images.generate(
                model='dall-e-3',
                prompt=user_prompt,
                size='1024x1024',
                quality='standard',
                n=1
            )
            
            result = {
                'type': 'image',
                'content': response.data[0].url,
                'model': 'dall-e-3'
            }
            
        else:
            result = {
                'type': 'video',
                'content': 'Генерация видео пока не поддерживается OpenAI API',
                'model': 'unavailable'
            }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps(result)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }
