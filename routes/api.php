<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

// Task Routes
Route::middleware('auth:sanctum')->get('/tasks', [TaskController::class, 'index']);
Route::middleware('auth:sanctum')->post('/tasks', [TaskController::class, 'store']);
Route::middleware('auth:sanctum')->delete('/tasks/{id}', [TaskController::class, 'destroy']);
