import json
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Обрабатывает запросы к OpenAI GPT API для генерации текста, изображений и видео
    Args: event - dict с httpMethod, body (содержит message и mode)
          context - объект с request_id, function_name
    Returns: HTTP response с результатом от OpenAI
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'OpenAI API key not configured'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    message: str = body_data.get('message', '')
    mode: str = body_data.get('mode', 'text')
    
    if not message:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Message is required'}),
            'isBase64Encoded': False
        }
    
    try:
        import requests
        
        if mode == 'text':
            response = requests.post(
                'https://api.openai.com/v1/chat/completions',
                headers={
                    'Authorization': f'Bearer {api_key}',
                    'Content-Type': 'application/json'
                },
                json={
                    'model': 'gpt-4o-mini',
                    'messages': [
                        {'role': 'system', 'content': 'Ты полезный AI-ассистент. Отвечай на русском языке кратко и по делу.'},
                        {'role': 'user', 'content': message}
                    ],
                    'max_tokens': 500
                },
                timeout=30
            )
            
            if response.status_code != 200:
                return {
                    'statusCode': response.status_code,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': f'OpenAI API error: {response.text}'}),
                    'isBase64Encoded': False
                }
            
            result = response.json()
            ai_message = result['choices'][0]['message']['content']
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'type': 'text',
                    'content': ai_message
                }),
                'isBase64Encoded': False
            }
        
        elif mode == 'image':
            response = requests.post(
                'https://api.openai.com/v1/images/generations',
                headers={
                    'Authorization': f'Bearer {api_key}',
                    'Content-Type': 'application/json'
                },
                json={
                    'model': 'dall-e-3',
                    'prompt': message,
                    'n': 1,
                    'size': '1024x1024',
                    'quality': 'standard'
                },
                timeout=60
            )
            
            if response.status_code != 200:
                return {
                    'statusCode': response.status_code,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': f'OpenAI API error: {response.text}'}),
                    'isBase64Encoded': False
                }
            
            result = response.json()
            image_url = result['data'][0]['url']
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'type': 'image',
                    'content': image_url
                }),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'type': 'text',
                    'content': 'Генерация видео пока не поддерживается. OpenAI не предоставляет публичный API для Sora.'
                }),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Error: {str(e)}'}),
            'isBase64Encoded': False
        }
