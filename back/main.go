package main

import (
    "log"
    "net/http"
    "github.com/gorilla/websocket"
)

func main() {
    log.Println("running...")
    
    http.HandleFunc("GET /{$}", func(w http.ResponseWriter, r *http.Request) {
        //
    })
    
    http.HandleFunc("GET /play/{$}", func(w http.ResponseWriter, r *http.Request) {
        //
    })
    
    http.HandleFunc("GET /play/{place}/{$}", func(w http.ResponseWriter, r *http.Request) {
        //
    })
    
    http.HandleFunc("GET /load/{place}/{$}", func(w http.ResponseWriter, r *http.Request) {
        //
    })
    
    http.HandleFunc("POST /sign/{$}", func(w http.ResponseWriter, r *http.Request) {
        //
    })
    
    http.HandleFunc("GET /write/{$}", func(w http.ResponseWriter, r *http.Request) {
        //
    })
    
    http.HandleFunc("GET /write/{place}/{$}", func(w http.ResponseWriter, r *http.Request) {
        //
    })
    
    http.HandleFunc("POST /write/{place}/{$}", func(w http.ResponseWriter, r *http.Request) {
        //
    })
    
    http.HandleFunc("GET /ws/{place}/{$}", func(w http.ResponseWriter, r *http.Request) {
        conn, err := upgrader.Upgrade(w, r, nil)
        if err != nil {
            log.Println(err)
            return
        }
        
        
    })
    
    log.Fatal(http.ListenAndServe(":8880", nil))
}