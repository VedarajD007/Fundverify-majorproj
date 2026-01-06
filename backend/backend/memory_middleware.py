import logging
import sys

class MemoryUsageMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Process the request
        response = self.get_response(request)
        
        # Log memory usage after request is processed
        # Only use resource on Unix systems
        try:
            import resource
            usage = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
            logging.info(f"Memory usage: {usage/1024:.2f} MB for {request.path}")
        except (ImportError, AttributeError):
            # resource module not available on Windows, skip
            pass
        
        return response