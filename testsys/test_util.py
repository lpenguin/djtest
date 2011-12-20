'''
Created on 20.12.2011

@author: prian
'''

from testsys.models import Scale
import json

CHOICE_TYPE = 1
WORDS_TYPE = 2

def clear_test_answers( test_data ):
    return test_data

def find_scale_value(scale_values, scale_id):
    for scale_value in scale_values:
        if int(scale_value["scale"]["id"]) == int(scale_id):
            return scale_value
    return None

def calculate_choice_task( scale_values, task, task_result ):
    selected_choice = task_result["choice"]
    for choice in task["choices"]:
        if choice["number"] == selected_choice["number"]:
            for scale in choice["scales"]:
                scale_value = find_scale_value( scale_values, scale["id"] )
                scale_value["value"] += int( scale["value"] )

def find_word(words, word):
    for w in words:
        if w["word"] == word["word"]:
            return w
    return None

def calculate_word_task( scale_values, task, task_result ):
    finded_words = task_result["findedWords"]
    words = task["words"]
    scale_value = find_scale_value( scale_values, task["scale"]["id"])
    for word in finded_words:
        w = find_word( words, word )
        if w : scale_value["value"] += 1
            


def calculate_results( test_result, test_result_data ):
    test_data = json.loads( test_result.resultData )
    test_result_data = json.loads( test_result_data )
    
    scale_values = []
    for scale in Scale.objects.filter( test = test_result.test ):
        scale_values.append( { "scale": { "id": scale.id, "name": scale.name}, "value" : 0 } )
        
    result_tasks = test_result_data["tasks"]
    
    for task in test_data["tasks"]:
        task_result = result_tasks.pop()["result"]
        if task["type"] == CHOICE_TYPE:
            calculate_choice_task( scale_values, task, task_result)
        elif task["type"] == WORDS_TYPE:
            calculate_word_task( scale_values, task, task_result)
    return scale_values
            