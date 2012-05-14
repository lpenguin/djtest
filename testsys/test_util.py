'''
Created on 20.12.2011

@author: prian
'''

from testsys.models import TestResult, TotalTestResult, Scale
import json
from math import fabs
CHOICE_TYPE = 1
WORDS_TYPE = 2
SPEED_TYPE = 3

def clear_test_answers( test_data ):
    return test_data

def find_scale_value(scale_values, scale_id):
    for scale_value in scale_values:
        if int(scale_value["scale"]["id"]) == int(scale_id):
            return scale_value
    return None

def calculate_choice_task( scale_values, task, task_result ):
    selected_choice = task_result["choice"]
    
    counter = 0
    #a=counter.a	
    for choice in task["choices"]:
        #if counter==0:
	    #    a=counter.a
        
        if not "number" in choice:
            continue
        if not "number" in selected_choice:
            continue
                    #counter+=1
        if choice["number"] == selected_choice["number"]:
            for scale in choice["scales"]:
                counter+=1

                scale_value = find_scale_value( scale_values, scale["id"] )
                if scale_value == None:
                    err = 'scale_value not found with id: %s' % scale['id']
                    a = counter.a                
                    raise
                scale_value["value"] += int( scale["value"] ) * scale_value["koeff"]


def calculate_speed_task( scale_values, task, task_result ):
    scale_value = find_scale_value( scale_values, task["scale"]["id"])
    sum = (int( task_result["clicks_d2"] ) - task_result["clicks1"]) \
            + (int( task_result["clicks_d3"] )- task_result["clicks2"]) \
            + (int( task_result["clicks_d4"] )- task_result["clicks3"])
    sum = sum / float(3)
    scale_value["value"] += sum * 10 * scale_value["koeff"]

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
        if w : scale_value["value"] += 1 * scale_value["koeff"]
            


def calculate_results( test_result, test_result_data ):
    test_data = json.loads( test_result.resultData )
    test_result_data = json.loads( test_result_data )
    
    scale_values = []
    for scale in Scale.objects.filter( test = test_result.test ):
        if scale.max!=None and scale.min!=None:
            koeff = 1 / float(scale.max - scale.min)
        else:
            koeff = 1
        min = scale.min*koeff
        scale_values.append( { "scale": { "id": scale.id, "name": scale.name}, "value" : 0, "koeff": koeff, 'min': min } )
    
            
    result_tasks = test_result_data["tasks"]
    
    for task in test_data["tasks"]:
        task_result = result_tasks.pop()["result"]
        if task["type"] == CHOICE_TYPE:
            calculate_choice_task( scale_values, task, task_result)
        elif task["type"] == WORDS_TYPE:
            calculate_word_task( scale_values, task, task_result)
        elif task["type"] == SPEED_TYPE:
            calculate_speed_task( scale_values, task, task_result)
    return scale_values
        
def calculate_total_results( user ):
    
    strs = []
    results = TestResult.objects.filter( user=user )
    
    counter = -1
    ids = []
    for result in results:
        ids.append( result.test.id )
        counter += 1
        #if result.test.is_form == 1:
        #    continue
        test = result.test
        is_form = result.test.is_form
        data = result.resultData
        #if counter == 2:
        #    a = counter.a#!!!!
        #    r = calculate_results( result, result.resultData )
        id = result.test.id
        
        if result.test.is_form == 0:
            strs.append( json.dumps( calculate_results( result, result.resultData ) ) )
        
    testRes = '['+', '.join(strs)+']'
    
    strs = []
    results = TestResult.objects.filter( user=user)
    for result in results:
        if result.test.is_form == 1:
            #if counter == 6:
            #    a = counter.a#!!!!
            strs.append( json.dumps( calculate_results( result, result.resultData ) ) )	
	formRes = '['+', '.join(strs)+']'

    return '{test:%s,form:%s}' % (testRes, formRes)